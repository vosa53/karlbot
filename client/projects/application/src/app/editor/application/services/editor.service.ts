import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Emitter } from 'projects/karel/src/lib/compiler/code-generation/emitter';
import { Error } from 'projects/karel/src/lib/compiler/errors/error';
import { ExternalProgramReference } from 'projects/karel/src/lib/compiler/external-program-reference';
import { CompletionItem } from 'projects/karel/src/lib/compiler/language-service/completion-item';
import { LanguageService } from 'projects/karel/src/lib/compiler/language-service/language-service';
import { Checker } from 'projects/karel/src/lib/compiler/semantic-analysis/checker';
import { ProgramSymbol } from 'projects/karel/src/lib/compiler/symbols/program-symbol';
import { CompilationUnitParser } from 'projects/karel/src/lib/compiler/syntax-analysis/compilation-unit-parser';
import { CallStackFrame } from 'projects/karel/src/lib/interpreter/call-stack-frame';
import { InterpretStopToken } from 'projects/karel/src/lib/interpreter/interpret-stop-token';
import { Interpreter } from 'projects/karel/src/lib/interpreter/interpreter';
import { ExceptionInterpretResult } from 'projects/karel/src/lib/interpreter/results/exception-interpret-result';
import { Vector } from 'projects/karel/src/lib/math/vector';
import { CodeFile } from 'projects/karel/src/lib/project/code-file';
import { File } from 'projects/karel/src/lib/project/file';
import { Project } from 'projects/karel/src/lib/project/project';
import { Settings } from 'projects/karel/src/lib/project/settings';
import { TownFile } from 'projects/karel/src/lib/project/town-file';
import { StandardLibrary } from 'projects/karel/src/lib/standard-library/standard-library';
import { MutableTown } from 'projects/karel/src/lib/town/town';
import { Town } from 'projects/karel/src/lib/town/town';
import { ProjectDeserializer, ProjectSerializer } from 'projects/karel/src/public-api';
import { BehaviorSubject, combineLatest, debounceTime, forkJoin, map, merge, pairwise, startWith, Subject } from 'rxjs';
import { SavedProject } from '../../../shared/application/models/saved-project';
import { ProjectService } from '../../../shared/application/services/project.service';
import { SignInService } from '../../../shared/application/services/sign-in.service';
import { TownCamera } from '../../../shared/presentation/town/town-camera';
import { EditorDialogService } from '../../presentation/services/editor-dialog.service';

@Injectable()
export class EditorService {
    private readonly savedProject = new BehaviorSubject<SavedProject | null>(null);
    private readonly project = new BehaviorSubject(this.createNewProject());
    private readonly selectedCodeFile = new BehaviorSubject<CodeFile | null>(null);
    private readonly selectedTownFile = new BehaviorSubject<TownFile | null>(null);
    private readonly currentTown = new BehaviorSubject<MutableTown | null>(null);
    private readonly townCamera = new BehaviorSubject(new TownCamera(Vector.ZERO, 1));
    private readonly interpreter = new BehaviorSubject<Interpreter | null>(null);
    private readonly interpretStopToken = new BehaviorSubject<InterpretStopToken | null>(null);

    readonly project$ = this.project.asObservable();
    readonly selectedCodeFile$ = this.selectedCodeFile.asObservable();
    readonly selectedTownFile$ = this.selectedTownFile.asObservable();
    readonly currentTown$ = this.currentTown.asObservable();
    readonly townCamera$ = this.townCamera.asObservable();

    readonly interpreter$ = this.interpreter.asObservable();
    readonly interpretStopToken$ = this.interpretStopToken.asObservable();

    readonly currentCode$ = this.selectedCodeFile.pipe(map(cf => {
        return cf?.compilationUnit?.buildText() ?? "";
    }));

    readonly availableEntryPoints$ = this.project.pipe(map(p => {
        return p.compilation.symbolTable.getDefined()
            .filter(s => s instanceof ProgramSymbol && s.definition.nameToken !== null)
            .map(s => (<ProgramSymbol>s).definition.nameToken!.text);
    }));

    readonly editorState$ = combineLatest([this.interpreter, this.interpretStopToken]).pipe(map(([interpreter, interpretStopToken]) => {
        if (interpreter === null)
            return EditorState.ready;
        else if (interpretStopToken !== null)
            return EditorState.running;
        else
            return EditorState.paused;
    }));

    readonly errors$ = this.project.pipe(debounceTime(700), startWith(this.project.value), map(p => {
        return Checker.check(p.compilation);
    }));

    readonly errorsInCurrentCodeFile$ = combineLatest([this.errors$, this.selectedCodeFile]).pipe(map(([errors, selectedCodeFile]) => {
        return errors.filter(e => e.compilationUnit === selectedCodeFile?.compilationUnit);
    }));

    private availableEntryPoints: readonly string[] = [];

    constructor(private readonly dialogService: EditorDialogService, private readonly projectService: ProjectService, 
        private readonly signInService: SignInService, private readonly router: Router, private readonly activatedRoute: ActivatedRoute,
        private readonly location: Location) {
        this.selectedTownFile.pipe(pairwise()).subscribe(([oldValue, newValue]) => {
            if (oldValue !== null) {
                const newTown = this.currentTown.value!.toImmutable();
                const newTownFile = oldValue.withTown(newTown);
                const newProject = this.project.value.replaceFile(oldValue, newTownFile);
                this.project.next(newProject);
            }

            this.currentTown.next(newValue?.town?.toMutable() ?? null);
        });
        this.availableEntryPoints$.subscribe(ae => this.availableEntryPoints = ae);
    }

    async openProject(projectId: number) {
        const savedProject = await this.projectService.getById(projectId);
        const project = ProjectDeserializer.deserialize(savedProject.projectFile, StandardLibrary.getProgramReferences());

        this.savedProject.next(savedProject);
        this.project.next(project);
    }

    async saveProject() {
        const currentUser = await this.signInService.currentUser;
        if (currentUser === null)
            throw new window.Error();

            
        let savedProject: SavedProject;
        if (this.savedProject.value === null) {
            const toSave = {
                id: 0,
                created: new Date(),
                modified: new Date(),
                isPublic: true,
                authorId: currentUser.id,
                projectFile: ProjectSerializer.serialize(this.project.value)
            };
            savedProject = await this.projectService.add(toSave);

            this.location.go(`editor/${savedProject.id}`);
        }
        else {
            const toSave = {
                ...this.savedProject.value,
                projectFile: ProjectSerializer.serialize(this.project.value)
            };
            await this.projectService.update(toSave);
            savedProject = await this.projectService.getById(toSave.id);
        }
        this.savedProject.next(savedProject);
    }

    addCodeFile(name: string) {
        const compilationUnit = CompilationUnitParser.parse("// New file", name);
        const file = new CodeFile(compilationUnit);
        const newProject = this.project.value.addFile(file);
        this.project.next(newProject);
    }

    addTownFile(name: string) {
        const town = Town.createEmpty(10, 10);
        const file = new TownFile(name, town);
        const newProject = this.project.value.addFile(file);
        this.project.next(newProject);
    }

    removeFile(file: File) {
        const newProject = this.project.value.removeFile(file);
        this.project.next(newProject);
    }

    renameFile(file: File, newName: string) {
        const newFile = file.withName(newName);
        const newProject = this.project.value.replaceFile(file, newFile);
        this.project.next(newProject);
    }

    selectFile(file: File) {
        if (file instanceof CodeFile)
            this.selectedCodeFile.next(file);
        else if (file instanceof TownFile)
            this.selectedTownFile.next(file);
    }

    async run(readonly: boolean) {
        if (this.hasErrors()) {
            await this.dialogService.showCompilationContainsErrorsMessage();
            return;
        }

        if (!this.availableEntryPoints.includes(this.project.value.settings.entryPoint)) {
            await this.dialogService.showSelectEntryPointMessage();
            return;
        }

        if (this.currentTown.value === null) {
            await this.dialogService.showSelectTownMessage();
            return;
        }

        this.interpreter.next(this.createInterpreter());
        this.interpretStopToken.next(new InterpretStopToken());

        const interpretResult = await this.interpreter.value!.interpretAll(this.interpretStopToken.value!);

        if (interpretResult instanceof ExceptionInterpretResult)
            await this.dialogService.showExceptionMessage(interpretResult.exception);

        this.interpreter.next(null);
        this.interpretStopToken.next(null);
    }

    stop() {
        this.interpretStopToken.value!.stop();
    }

    undo() {

    }

    redo() {

    }

    changeCode(code: string) {
        if (this.selectedCodeFile.value === null)
            return;

        const newCompilationUnit = CompilationUnitParser.parse(code, this.selectedCodeFile.value.compilationUnit.filePath);
        const newCodeFile = this.selectedCodeFile.value.withCompilationUnit(newCompilationUnit);
        const newProject = this.project.value.replaceFile(this.selectedCodeFile.value, newCodeFile);
        
        this.selectedCodeFile.next(newCodeFile);
        this.project.next(newProject)

        /*if (!this.availableEntryPoints.includes(this._project.settings.entryPoint)) {
            const newEntryPoint = this.availableEntryPoints[0] ?? "";
            const newSettings = this._project.settings.withEntryPoint(newEntryPoint);
            const newProject = this._project.withSettings(newSettings);
            this._project = newProject
        }*/
    }

    changeTownCamera(townCamera: TownCamera) {
        this.townCamera.next(townCamera);
    }

    changeSettings(settings: Settings) {
        const newProject = this.project.value.withSettings(settings);
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

    private createInterpreter(): Interpreter {
        const assembly = Emitter.emit(this.project.value.compilation);
        const interpreter = new Interpreter();

        const externalPrograms = StandardLibrary.getPrograms(this.currentTown.value!, () => 100);
        for (const externalProgram of externalPrograms)
            interpreter.addExternalProgram(externalProgram);

        const entryPoint = assembly.programs.find(p => p.name === this.project.value.settings.entryPoint)!;
        interpreter.callStack.push(new CallStackFrame(entryPoint));

        return interpreter;
    }

    private hasErrors(): boolean {
        const errors = Checker.check(this.project.value.compilation);
        return errors.length !== 0;
    }

    private createNewProject(): Project {
        const code = `program DFS
    put
    repeat 4 times
        if not wall
            step
            if not sign
                DFS
            end
            turnBack
            step
            turnBack
        end
        turnLeft
    end
end
`;
        const code2 = `program turnRight
    repeat 3 times
        turnLeft
    end
end

program turnBack
    repeat 2 times
        turnLeft
    end
end
`;

        const files = [
            new CodeFile(CompilationUnitParser.parse(code, "Programs")),
            new CodeFile(CompilationUnitParser.parse(code2, "Programs2")),
            new TownFile("Town", Town.createEmpty(20, 20)),
            new TownFile("Town2", Town.createEmpty(10, 10))
        ];
        const externalPrograms: ExternalProgramReference[] = StandardLibrary.getProgramReferences();
        const settings = new Settings("main", 200, 1000);
        
        return Project.create("Project", files, externalPrograms, settings);
    }
}

export enum EditorState {
    ready = "ready",
    running = "running",
    paused = "paused"
}