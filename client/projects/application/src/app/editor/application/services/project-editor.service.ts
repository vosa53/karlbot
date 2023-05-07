import { Injectable } from "@angular/core";
import { Checker } from "karel";
import { CompilationUnitParser } from "karel";
import { Vector } from "karel";
import { CodeFile } from "karel";
import { Project } from "karel";
import { ProjectDeserializer } from "karel";
import { Settings } from "karel";
import { TownFile } from "karel";
import { MutableTown, ReadonlyTown, Town } from "karel";
import { CompletionItem, File, LanguageService, ProgramSymbol, ProjectSerializer, StandardLibrary } from "karel";
import { BehaviorSubject, combineLatest, debounceTime, map, startWith } from "rxjs";
import { FileService } from "../../../shared/application/services/file-service";
import { DialogService } from "../../../shared/presentation/services/dialog.service";
import { TownCamera } from "../../../shared/presentation/town/town-camera";

/**
 * Edits the project, provides editation services and manages the project state.
 */
@Injectable()
export class ProjectEditorService {
    private readonly project = new BehaviorSubject(Project.create("", [], [], new Settings("", 0, 0)));
    private readonly selectedCodeFile = new BehaviorSubject<CodeFile | null>(null);
    private readonly selectedTownFile = new BehaviorSubject<TownFile | null>(null);
    private readonly currentTown = new BehaviorSubject<MutableTown | null>(null);
    private readonly currentTownCamera = new BehaviorSubject(new TownCamera(Vector.ZERO, 1));

    /**
     * Edited project.
     */
    readonly project$ = this.project.asObservable();

    /**
     * Selected code file.
     */
    readonly selectedCodeFile$ = this.selectedCodeFile.asObservable();

    /**
     * Selected town file.
     */
    readonly selectedTownFile$ = this.selectedTownFile.asObservable();

    /**
     * Code from the selected code file.
     */
    readonly currentCode$ = this.selectedCodeFile.pipe(map(cf => {
        return cf?.compilationUnit?.buildText() ?? null;
    }));

    /**
     * Town from the selected town file.
     */
    readonly currentTown$ = this.currentTown.asObservable();

    /**
     * Town camera in the town editor.
     */
    readonly currentTownCamera$ = this.currentTownCamera.asObservable();

    /**
     * Names of programs that can be used as an entry point.
     */
    readonly availableEntryPoints$ = this.project.pipe(map(p => {
        return p.compilation.symbolTable.getDefined()
            .filter(s => s instanceof ProgramSymbol && s.definition.nameToken !== null)
            .map(s => (<ProgramSymbol>s).definition.nameToken!.text);
    }));

    /**
     * Errors in the whole project.
     */
    readonly errors$ = this.project.pipe(debounceTime(700), startWith(this.project.value), map(p => {
        return Checker.check(p.compilation);
    }));

    /**
     * Errors in the selected code file.
     */
    readonly errorsInCurrentCodeFile$ = combineLatest([this.errors$, this.selectedCodeFile]).pipe(map(([errors, selectedCodeFile]) => {
        return errors.filter(e => e.compilationUnit === selectedCodeFile?.compilationUnit);
    }));

    constructor(
        private readonly fileService: FileService, 
        private readonly dialogService: DialogService
    ) { }

    /**
     * Sets the edited project.
     * @param project Project to set.
     */
    setProject(project: Project) {
        this.saveCurrentTown();
        this.project.next(project);
        this.selectedCodeFile.next(null);
        this.selectedTownFile.next(null);
        this.currentTown.next(null);
        
        const firstCodeFile = this.project.value.files.find(f => f instanceof CodeFile) ?? null;
        const firstTownFile = this.project.value.files.find(f => f instanceof TownFile) ?? null;
        this.selectCodeFile(firstCodeFile as CodeFile);
        this.selectTownFile(firstTownFile as TownFile);
    }

    /**
     * Gets the edited project.
     */
    getProject(): Project {
        this.saveCurrentTown();
        return this.project.value;
    }

    /**
     * Imports a project locally from the device.
     */
    async importProject() {
        const projectFile = await this.fileService.open();
        if (projectFile === null)
            return;

        const projectFileText = await projectFile.text();
        let project: Project;
        try {
            project = ProjectDeserializer.deserialize(projectFileText, StandardLibrary.getProgramReferences());
        } catch {
            this.dialogService.showMessage("Invalid project file", "The project file has an invalid format.");
            return;
        }

        this.setProject(project);
    }

    /**
     * Exports the project locally to the device.
     */
    async exportProject() {
        const project = this.getProject();
        const projectFileText = ProjectSerializer.serialize(project);
        const projectFile = new window.File([projectFileText], project.name + ".kbp");
        await this.fileService.save(projectFile);
    }

    /**
     * Creates a new code file.
     * @param name Name of the new file.
     */
    addCodeFile(name: string) {
        const newFile = this.createNewCodeFile(name);
        this.addFile(newFile);
    }

    /**
     * Creates a new town file.
     * @param name Name of the new file.
     */
    addTownFile(name: string) {
        const newFile = this.createNewTownFile(name);
        this.addFile(newFile);
    }

    /**
     * Removes a file.
     * @param file File to remove.
     */
    removeFile(file: File) {
        const newProject = this.project.value.removeFile(file);
        this.project.next(newProject);
        
        if (file === this.selectedCodeFile.value)
            this.selectedCodeFile.next(null);
        if (file === this.selectedTownFile.value) {
            this.selectedTownFile.next(null);
            this.loadCurrentTown();
        }
    }

    /**
     * Renames a file.
     * @param file File to rename.
     * @param newName New name of the file.
     */
    renameFile(file: File, newName: string) {
        const newFile = file.withName(newName);
        this.replaceFile(file, newFile);
    }

    /**
     * Selects a file.
     * @param file File to select.
     */
    selectFile(file: File) {
        if (file instanceof CodeFile)
            this.selectCodeFile(file);
        else if (file instanceof TownFile)
            this.selectTownFile(file);
    }

    /**
     * Selects a code file.
     * @param file Code file to select.
     */
    selectCodeFile(file: CodeFile | null) {
        this.selectedCodeFile.next(file);
    }

    /**
     * Selectes a town file.
     * @param file Town file to select.
     */
    selectTownFile(file: TownFile | null) {
        if (file === this.selectedTownFile.value)
            return;
        
        this.saveCurrentTown();
        this.selectedTownFile.next(file);
        this.loadCurrentTown();
        if (file !== null)
            this.currentTownCamera.next(this.createTownCamera(file.town));
    }

    /**
     * Changes the code in the open code file.
     * @param code New code.
     */
    changeCode(code: string) {
        if (this.selectedCodeFile.value === null)
            return;

        const newCompilationUnit = CompilationUnitParser.parse(code, this.selectedCodeFile.value.compilationUnit.filePath);
        const newCodeFile = this.selectedCodeFile.value.withCompilationUnit(newCompilationUnit);
        this.replaceFile(this.selectedCodeFile.value, newCodeFile);
    }

    /**
     * Sets breakpoints on the given lines.
     * @param breakpoints Line numbers where the breakpoints should be set. Line number starts at 1.
     */
    changeBreakpoints(breakpoints: readonly number[]) {
        if (this.selectedCodeFile.value === null)
            return;

        const newCodeFile = this.selectedCodeFile.value.withBreakpoints(breakpoints);
        this.replaceFile(this.selectedCodeFile.value, newCodeFile);
    }

    /**
     * Changes the town camera in the town editor.
     * @param townCamera New town camera.
     */
    changeCurrentTownCamera(townCamera: TownCamera) {
        this.currentTownCamera.next(townCamera);
    }

    /**
     * Changes the project settings.
     * @param settings New settings.
     */
    changeSettings(settings: Settings) {
        const newProject = this.project.value.withSettings(settings);
        this.project.next(newProject);
    }

    /**
     * Changes the project name.
     * @param projectName New project name.
     */
    changeProjectName(projectName: string) {
        const newProject = this.project.value.withName(projectName);
        this.project.next(newProject);
    }

    /**
     * Changes the name of the project entry point.
     * @param entryPoint New entry point name.
     */
    changeEntryPoint(entryPoint: string) {
        const newSettings = this.project.value.settings.withEntryPoint(entryPoint);
        this.changeSettings(newSettings);
    }

    /**
     * Provides completion items at the given code position.
     * @param line Line number. Starts at 1.
     * @param column Column number. Starts at 1.
     */
    provideCompletionItems(line: number, column: number): CompletionItem[] {
        const languageService = new LanguageService(this.project.value.compilation);
        return languageService.getCompletionItemsAt(this.selectedCodeFile.value!.compilationUnit, line, column);
    }

    private addFile(file: File) {
        const newProject = this.project.value.addFile(file);
        this.project.next(newProject);
        this.selectFile(file);
    }

    private replaceFile(oldFile: File, newFile: File) {
        const newProject = this.project.value.replaceFile(oldFile, newFile);
        this.project.next(newProject);

        if (oldFile === this.selectedCodeFile.value)
            this.selectedCodeFile.next(newFile as CodeFile);
        if (oldFile === this.selectedTownFile.value)
            this.selectedTownFile.next(newFile as TownFile);
    }

    private loadCurrentTown() {
        this.currentTown.next(this.selectedTownFile.value?.town?.toMutable() ?? null);
    }

    private saveCurrentTown() {
        if (this.selectedTownFile.value !== null) {
            const newTown = this.currentTown.value!.toImmutable();
            const newTownFile = this.selectedTownFile.value.withTown(newTown);
            this.replaceFile(this.selectedTownFile.value, newTownFile);
        }
    }

    private createNewCodeFile(name: string): CodeFile {
        const compilationUnit = CompilationUnitParser.parse(`program ${this.createProgramName(name)}\n    // Write code here\nend`, name);
        return new CodeFile(compilationUnit, []);
    }

    private createNewTownFile(name: string): TownFile {
        const town = Town.createEmpty(10, 10);
        return new TownFile(name, town);
    }

    private createTownCamera(town: ReadonlyTown): TownCamera {
        const centerTile = new Vector(town.width / 2, town.height / 2);
        return new TownCamera(centerTile, 1);
    }

    private createProgramName(name: string) {
        return name
            .replaceAll(/[^a-zA-Z0-9 ]/g, "")
            .replace(/^[0-9 ]*/, "")
            .replace(/[ ]$/, "")
            .replace(/^(.)/, (m, c) => c.toLowerCase())
            .replaceAll(/ +(.)/g, (m, c) => c.toUpperCase());
    }
}