import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FileLineTextRange } from 'projects/karel/src/lib/assembly/source-map';
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
import { ReadonlyCallStackFrame } from 'projects/karel/src/lib/interpreter/readonly-call-stack-frame';
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
import { Assembly, Instruction, InterpretResult, NormalInterpretResult, ProjectDeserializer, ProjectSerializer, StopInterpretResult } from 'projects/karel/src/public-api';
import { BehaviorSubject, combineLatest, debounceTime, forkJoin, map, merge, pairwise, startWith, Subject } from 'rxjs';
import { SavedProject } from '../../../shared/application/models/saved-project';
import { FileService } from '../../../shared/application/services/file-service';
import { ProjectService } from '../../../shared/application/services/project.service';
import { SignInService } from '../../../shared/application/services/sign-in.service';
import { NotificationService } from '../../../shared/presentation/services/notification.service';
import { TownCamera } from '../../../shared/presentation/town/town-camera';
import { EditorDialogService } from '../../presentation/services/editor-dialog.service';

@Injectable()
export class EditorService {
    private readonly savedProject = new BehaviorSubject<SavedProject | null>(null);
    private readonly project = new BehaviorSubject(this.createNewProject());
    private readonly selectedCodeFile = new BehaviorSubject<CodeFile | null>(null);
    private readonly selectedTownFile = new BehaviorSubject<TownFile | null>(null);
    private readonly currentTown = new BehaviorSubject<MutableTown | null>(null);
    private readonly townCamera = new BehaviorSubject(new TownCamera(new Vector(5, 5), 1));
    private readonly interpreter = new BehaviorSubject<Interpreter | null>(null);
    private readonly interpretStopToken = new BehaviorSubject<InterpretStopToken | null>(null);
    private readonly callStack = new BehaviorSubject<readonly ReadonlyCallStackFrame[] | null>(null);
    private readonly activeArea = new BehaviorSubject<EditorArea>(EditorArea.code);

    readonly project$ = this.project.asObservable();
    readonly selectedCodeFile$ = this.selectedCodeFile.asObservable();
    readonly selectedTownFile$ = this.selectedTownFile.asObservable();
    readonly currentTown$ = this.currentTown.asObservable();
    readonly townCamera$ = this.townCamera.asObservable();

    readonly interpreter$ = this.interpreter.asObservable();
    readonly interpretStopToken$ = this.interpretStopToken.asObservable();

    readonly callStack$ = this.callStack.asObservable();
    readonly activeArea$ = this.activeArea.asObservable();

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

    readonly currentRange$ = combineLatest([this.callStack$, this.selectedCodeFile]).pipe(map(([callStack, selectedCodeFile]) => {
        if (callStack === null || callStack.length === 0 || selectedCodeFile === null)
            return null;

        const currentRange = this.assembly!.sourceMap.getRangeByInstruction(callStack[callStack.length - 1].currentInstruction);

        if (currentRange.filePath === selectedCodeFile.name)
            return currentRange.textRange;
        
        return null;
    }));

    private availableEntryPoints: readonly string[] = [];
    private assembly: Assembly | null = null;
    private willPause = false;
    private isDebuggerStep = false;

    constructor(private readonly dialogService: EditorDialogService, private readonly projectService: ProjectService, 
        private readonly signInService: SignInService, private readonly router: Router, private readonly activatedRoute: ActivatedRoute,
        private readonly location: Location, private readonly fileService: FileService, private readonly notificationService: NotificationService) {
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
        this.openFirstFiles();
    }

    setActiveArea(area: EditorArea) {
        this.activeArea.next(area);
    }

    async openProject(projectId: number) {
        const savedProject = await this.projectService.getById(projectId);
        const project = savedProject.project.withExternalPrograms(StandardLibrary.getProgramReferences());

        this.savedProject.next(savedProject);
        this.project.next(project);
        this.openFirstFiles();
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
                project: this.project.value
            };
            savedProject = await this.projectService.add(toSave);

            this.location.go(`editor/${savedProject.id}`);
        }
        else {
            const toSave = {
                ...this.savedProject.value,
                project: this.project.value
            };
            await this.projectService.update(toSave);
            savedProject = await this.projectService.getById(toSave.id);
        }
        this.savedProject.next(savedProject);
        this.notificationService.show("Project was successfully saved.");
    }

    async importProject() {
        const projectFile = await this.fileService.open();
        if (projectFile === null)
            return;

        const projectFileText = await projectFile.text();
        try {
            const project = ProjectDeserializer.deserialize(projectFileText, StandardLibrary.getProgramReferences());
            this.project.next(project);
        } catch {
            alert("Invalid project file");
        }
    }

    async exportProject() {
        const projectFileText = ProjectSerializer.serialize(this.project.value);
        const projectFile = new window.File([projectFileText], this.project.value.name + ".kbp");
        await this.fileService.save(projectFile);
    }

    addCodeFile(name: string) {
        const compilationUnit = CompilationUnitParser.parse("// New file", name);
        const file = new CodeFile(compilationUnit, []);
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
        if (file instanceof CodeFile) {
            this.selectedCodeFile.next(file);
            this.activeArea.next(EditorArea.code);
        }
        else if (file instanceof TownFile) {
            this.selectedTownFile.next(file);
            this.activeArea.next(EditorArea.town);
        }
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

        this.activeArea.next(EditorArea.town);

        this.interpreter.next(this.createInterpreter());
        this.setInterpreterBreakpoints();
        await this.continue();
        this.interpreter.value!.skipBreakpointOnFirstInstruction = true;
    }

    stop() {
        this.willPause = false;
        const stopToken = this.interpretStopToken.value;
        if (stopToken !== null)
            stopToken.stop();
        else
            this.setReadyState();
    }

    pause() {
        this.willPause = true;
        this.interpretStopToken.value!.stop();
    }

    async continue() {
        await this._run(st => this.interpreter.value!.interpretAll(st));
    }

    async stepInto() {
        this.isDebuggerStep = true;
        await this._run(st => this.interpreter.value!.interpretStepInto(st));
        this.isDebuggerStep = false;
    }

    async stepOver() {
        this.isDebuggerStep = true;
        await this._run(st => this.interpreter.value!.interpretStepOver(st));
        this.isDebuggerStep = false;
    }

    async stepOut() {
        this.isDebuggerStep = true;
        await this._run(st => this.interpreter.value!.interpretStepOut(st));
        this.isDebuggerStep = false;
    }

    private async _run(action: (stopToken: InterpretStopToken) => Promise<InterpretResult>) {
        this.callStack.next(null);
        this.interpretStopToken.next(new InterpretStopToken());
        const result = await action(this.interpretStopToken.value!);

        this.interpretStopToken.next(null);
        const callStack = this.interpreter.value!.getCallStack();

        const isFullStop = result instanceof NormalInterpretResult && callStack.length === 0 || 
            result instanceof StopInterpretResult && !this.willPause;
        if (isFullStop) {
            this.setReadyState();
        }
        else {
            this.callStack.next(callStack);
            this.activeArea.next(EditorArea.code);
            if (result instanceof ExceptionInterpretResult) {
                this.callStack.next(result.exception.callStack);
                await this.dialogService.showExceptionMessage(result.exception);
            }
        }
    }

    private setReadyState() {
        this.interpreter.next(null);
        this.callStack.next(null);
    }

    private setInterpreterBreakpoints() {
        const breakpointInstructions: Instruction[] = [];
        
        for (const file of this.project.value.files) {
            if (!(file instanceof CodeFile))
                continue;
            
            for (const breakpoint of file.breakpoints) {
                const breakpointLineInstruction = this.assembly!.sourceMap.getInstructionsByLine(file.name, breakpoint);
                if (breakpointLineInstruction.length !== 0)
                    breakpointInstructions.push(breakpointLineInstruction[0]);
            }
        }
        this.interpreter.value!.setBreakpoints(breakpointInstructions);
    }

    changeCode(code: string) {
        if (this.selectedCodeFile.value === null)
            return;

        const newCompilationUnit = CompilationUnitParser.parse(code, this.selectedCodeFile.value.compilationUnit.filePath);
        const newCodeFile = this.selectedCodeFile.value.withCompilationUnit(newCompilationUnit);
        const newProject = this.project.value.replaceFile(this.selectedCodeFile.value, newCodeFile);
        
        this.selectedCodeFile.next(newCodeFile);
        this.project.next(newProject);
    }

    changeBreakpoints(breakpoints: readonly number[]) {
        if (this.selectedCodeFile.value === null)
            return;

        console.log(this.selectedCodeFile.value.name + " " + JSON.stringify(breakpoints));

        const newCodeFile = this.selectedCodeFile.value.withBreakpoints(breakpoints);
        const newProject = this.project.value.replaceFile(this.selectedCodeFile.value, newCodeFile);
        
        this.selectedCodeFile.next(newCodeFile);
        this.project.next(newProject);

        if (this.interpreter.value !== null)
            this.setInterpreterBreakpoints();
    }

    changeTownCamera(townCamera: TownCamera) {
        this.townCamera.next(townCamera);
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

    async share() {
        const savedProject = this.savedProject.value;
        if (savedProject === null) {
            await this.dialogService.showCanNotShareUnsavedProjectMessage();
            return;
        }

        const projectUrl = window.location.host + "/editor" + savedProject.id;
        const newIsProjectPublic = await this.dialogService.showShare(savedProject.isPublic, projectUrl);
        if (newIsProjectPublic === null)
            return;

        const newSavedProject = {
            ...savedProject,
            isPublic: newIsProjectPublic
        };
        this.savedProject.next(newSavedProject);
    }

    provideCompletionItems(line: number, column: number): CompletionItem[] {
        const languageService = new LanguageService(this.project.value.compilation);
        return languageService.getCompletionItemsAt(this.selectedCodeFile.value!.compilationUnit, line, column);
    }

    private createInterpreter(): Interpreter {
        this.assembly = Emitter.emit(this.project.value.compilation);
        const entryPoint = this.assembly.programs.find(p => p.name === this.project.value.settings.entryPoint)!;
        const externalPrograms = StandardLibrary.getPrograms(this.currentTown.value!, () => this.isDebuggerStep ? 0 : this.project.value.settings.karelSpeed);

        return new Interpreter(this.assembly, entryPoint, externalPrograms);
    }

    private hasErrors(): boolean {
        const errors = Checker.check(this.project.value.compilation);
        return errors.length !== 0;
    }

    private openFirstFiles() {
        const codeFile = this.project.value.files.find(f => f instanceof CodeFile);
        if (codeFile !== undefined)
            this.selectFile(codeFile);

        const townFile = this.project.value.files.find(f => f instanceof TownFile);
        if (townFile !== undefined)
            this.selectFile(townFile);
    }

    private createNewProject(): Project {
        const code = `/**
 * Karel program doing a depth first search algorithm.
 */
program DFS
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
            new CodeFile(CompilationUnitParser.parse(code, "DFS"), []),
            new CodeFile(CompilationUnitParser.parse(code2, "Utils"), []),
            new TownFile("Village", Town.createEmpty(10, 10)),
            new TownFile("Town", Town.createEmpty(20, 20))
        ];
        const externalPrograms: ExternalProgramReference[] = StandardLibrary.getProgramReferences();
        const settings = new Settings("DFS", 200, 1000);
        
        return Project.create("Project", files, externalPrograms, settings);
    }
}

export enum EditorState {
    ready = "ready",
    running = "running",
    paused = "paused"
}

export enum EditorArea {
    files = "files",
    settings = "settings",
    code = "code",
    errors = "errors",
    callStack = "callStack",
    town = "town"
}