import { Injectable } from "@angular/core";
import { Checker } from "projects/karel/src/lib/compiler/semantic-analysis/checker";
import { CompilationUnitParser } from "projects/karel/src/lib/compiler/syntax-analysis/compilation-unit-parser";
import { Vector } from "projects/karel/src/lib/math/vector";
import { CodeFile } from "projects/karel/src/lib/project/code-file";
import { Project } from "projects/karel/src/lib/project/project";
import { ProjectDeserializer } from "projects/karel/src/lib/project/project-deserializer";
import { Settings } from "projects/karel/src/lib/project/settings";
import { TownFile } from "projects/karel/src/lib/project/town-file";
import { MutableTown, ReadonlyTown, Town } from "projects/karel/src/lib/town/town";
import { CompletionItem, File, LanguageService, ProgramSymbol, ProjectSerializer, StandardLibrary } from "projects/karel/src/public-api";
import { BehaviorSubject, combineLatest, debounceTime, map, startWith } from "rxjs";
import { FileService } from "../../../shared/application/services/file-service";
import { DialogService } from "../../../shared/presentation/services/dialog.service";
import { TownCamera } from "../../../shared/presentation/town/town-camera";

@Injectable()
export class ProjectEditorService {
    private readonly project = new BehaviorSubject(Project.create("", [], [], new Settings("", 0, 0)));
    private readonly selectedCodeFile = new BehaviorSubject<CodeFile | null>(null);
    private readonly selectedTownFile = new BehaviorSubject<TownFile | null>(null);
    private readonly currentTown = new BehaviorSubject<MutableTown | null>(null);
    private readonly currentTownCamera = new BehaviorSubject(new TownCamera(Vector.ZERO, 1));

    readonly project$ = this.project.asObservable();
    readonly selectedCodeFile$ = this.selectedCodeFile.asObservable();
    readonly selectedTownFile$ = this.selectedTownFile.asObservable();
    readonly currentTown$ = this.currentTown.asObservable();
    readonly currentTownCamera$ = this.currentTownCamera.asObservable();

    readonly currentCode$ = this.selectedCodeFile.pipe(map(cf => {
        return cf?.compilationUnit?.buildText() ?? null;
    }));

    readonly availableEntryPoints$ = this.project.pipe(map(p => {
        return p.compilation.symbolTable.getDefined()
            .filter(s => s instanceof ProgramSymbol && s.definition.nameToken !== null)
            .map(s => (<ProgramSymbol>s).definition.nameToken!.text);
    }));

    readonly errors$ = this.project.pipe(debounceTime(700), startWith(this.project.value), map(p => {
        return Checker.check(p.compilation);
    }));

    readonly errorsInCurrentCodeFile$ = combineLatest([this.errors$, this.selectedCodeFile]).pipe(map(([errors, selectedCodeFile]) => {
        return errors.filter(e => e.compilationUnit === selectedCodeFile?.compilationUnit);
    }));

    constructor(private readonly fileService: FileService, private readonly dialogService: DialogService) { }

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

    getProject(): Project {
        this.saveCurrentTown();
        return this.project.value;
    }

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

    async exportProject() {
        const project = this.getProject();
        const projectFileText = ProjectSerializer.serialize(project);
        const projectFile = new window.File([projectFileText], project.name + ".kbp");
        await this.fileService.save(projectFile);
    }

    addCodeFile(name: string) {
        const newFile = this.createNewCodeFile(name);
        this.addFile(newFile);
    }

    addTownFile(name: string) {
        const newFile = this.createNewTownFile(name);
        this.addFile(newFile);
    }

    removeFile(file: File) {
        const newProject = this.project.value.removeFile(file);
        this.project.next(newProject);
    }

    renameFile(file: File, newName: string) {
        const newFile = file.withName(newName);
        this.replaceFile(file, newFile);
    }

    selectFile(file: File) {
        if (file instanceof CodeFile)
            this.selectCodeFile(file);
        else if (file instanceof TownFile)
            this.selectTownFile(file);
    }

    selectCodeFile(file: CodeFile | null) {
        this.selectedCodeFile.next(file);
    }

    selectTownFile(file: TownFile | null) {
        this.saveCurrentTown();
        this.selectedTownFile.next(file);
        this.loadCurrentTown();
        if (file !== null)
            this.currentTownCamera.next(this.createTownCamera(file.town));
    }

    changeCode(code: string) {
        if (this.selectedCodeFile.value === null)
            return;

        const newCompilationUnit = CompilationUnitParser.parse(code, this.selectedCodeFile.value.compilationUnit.filePath);
        const newCodeFile = this.selectedCodeFile.value.withCompilationUnit(newCompilationUnit);
        this.replaceFile(this.selectedCodeFile.value, newCodeFile);
    }

    changeBreakpoints(breakpoints: readonly number[]) {
        if (this.selectedCodeFile.value === null)
            return;

        const newCodeFile = this.selectedCodeFile.value.withBreakpoints(breakpoints);
        this.replaceFile(this.selectedCodeFile.value, newCodeFile);
    }

    changeCurrentTownCamera(townCamera: TownCamera) {
        this.currentTownCamera.next(townCamera);
    }

    changeSettings(settings: Settings) {
        const newProject = this.project.value.withSettings(settings);
        this.project.next(newProject);
    }

    changeProjectName(projectName: string) {
        const newProject = this.project.value.withName(projectName);
        this.project.next(newProject);
    }

    changeEntryPoint(entryPoint: string) {
        const newSettings = this.project.value.settings.withEntryPoint(entryPoint);
        this.changeSettings(newSettings);
    }

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
            const newProject = this.project.value.replaceFile(this.selectedTownFile.value, newTownFile);
            this.project.next(newProject);
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