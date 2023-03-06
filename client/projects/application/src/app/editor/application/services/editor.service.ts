import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
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
import { MutableTown } from 'projects/karel/src/lib/town/mutable-town';
import { Town } from 'projects/karel/src/lib/town/town';
import { TownCamera } from '../../../shared/presentation/town/town-camera';
import { EditorDialogService } from '../../presentation/services/editor-dialog.service';

@Injectable()
export class EditorService {
    get project(): Project {
        return this._project;
    }

    get availableEntryPoints(): string[] {
        return this.project.compilation.symbolTable.getDefined()
            .filter(s => s instanceof ProgramSymbol && s.definition.nameToken !== null)
            .map(s => (<ProgramSymbol>s).definition.nameToken!.text);
    }

    get selectedCodeFile(): CodeFile | null {
        return this._selectedCodeFile;
    }

    get selectedTownFile(): TownFile | null {
        return this._selectedTownFile;
    }

    get currentCode(): string {
        if (this.selectedCodeFile === null)
            return "";
        return this.selectedCodeFile.compilationUnit.buildText();
    }

    get currentTown(): MutableTown | null {
        return this._currentTown;
    }

    get townCamera(): TownCamera {
        return this._townCamera;
    }

    get errors(): readonly Error[] {
        return this._errors;
    }

    get errorsInCurrentCodeFile(): readonly Error[] {
        return this._errorsInCurrentCodeFile;
    }

    get editorState(): EditorState {
        if (this.interpreter === null)
            return EditorState.ready;
        else if (this.interpretStopToken !== null)
            return EditorState.running;
        else
            return EditorState.paused;
    }

    private _project = this.createNewProject();
    private _selectedCodeFile: CodeFile | null = null;
    private _selectedTownFile: TownFile | null = null;
    private _currentTown: MutableTown | null = null;
    private _townCamera: TownCamera = new TownCamera(Vector.ZERO, 1);
    private _errors: readonly Error[] = [];
    private _errorsInCurrentCodeFile: readonly Error[] = [];
    private interpreter: Interpreter | null = null;
    private interpretStopToken: InterpretStopToken | null = null;
    private checkTimeoutRef: number | null = null;

    constructor(private readonly dialogService: EditorDialogService) {
        
    }

    addCodeFile(name: string) {
        const compilationUnit = CompilationUnitParser.parse("// New file", name);
        const file = new CodeFile(CompilationUnitParser.parse("// New file", name));
        this._project = this._project.addFile(file);
    }

    addTownFile(name: string) {
        const town = Town.createEmpty(10, 10);
        const file = new TownFile(name, town);
        this._project = this._project.addFile(file);
    }

    removeFile(file: File) {
        this._project = this._project.removeFile(file);
    }

    renameFile(file: File, newName: string) {
        const newFile = file.withName(newName);
        this._project = this._project.replaceFile(file, newFile);
    }

    selectFile(file: File) {
        if (file instanceof CodeFile)
            this._selectedCodeFile = file;
        else if (file instanceof TownFile) {
            if (this._selectedTownFile === file)
                return;

            if (this._selectedTownFile !== null) {
                const newTownFile = this._selectedTownFile.withTown(this._currentTown!.toImmutable());
                this._project = this._project.replaceFile(this._selectedTownFile, newTownFile);
            }
            this._selectedTownFile = file;
            this._currentTown = file.town.toMutable();
        }
    }

    async run(readonly: boolean) {
        const errors = Checker.check(this.project.compilation);

        if (errors.length !== 0) {
            await this.dialogService.showCompilationContainsErrorsMessage();
            return;
        }

        const assembly = Emitter.emit(this.project.compilation);

        this.interpreter = new Interpreter();
        this.interpretStopToken = new InterpretStopToken();

        const externalPrograms = StandardLibrary.getPrograms(this._currentTown!, () => 100);
        for (const externalProgram of externalPrograms)
            this.interpreter.addExternalProgram(externalProgram);

        const entryPoint = assembly.programs.find(p => p.name === this.project.settings.entryPoint)!;
        this.interpreter.callStack.push(new CallStackFrame(entryPoint));
        this.interpretStopToken = new InterpretStopToken();

        const interpretResult = await this.interpreter.interpretAll(this.interpretStopToken);

        if (interpretResult instanceof ExceptionInterpretResult)
            await this.dialogService.showExceptionMessage(interpretResult.exception);

        this.interpreter = null;
        this.interpretStopToken = null;
    }

    stop() {
        this.interpretStopToken!.stop();
    }

    undo() {

    }

    redo() {

    }

    changeCode(code: string) {
        if (this.selectedCodeFile === null)
            return;

        const newCompilationUnit = CompilationUnitParser.parse(code, this.selectedCodeFile.compilationUnit.filePath);
        const newCodeFile = this.selectedCodeFile.withCompilationUnit(newCompilationUnit);
        this._project = this._project.replaceFile(this.selectedCodeFile, newCodeFile);
        this._selectedCodeFile = newCodeFile;
        if (!this.availableEntryPoints.includes(this._project.settings.entryPoint)) {
            const newEntryPoint = this.availableEntryPoints[0] ?? "";
            const newSettings = this._project.settings.withEntryPoint(newEntryPoint);
            const newProject = this._project.withSettings(newSettings);
            this._project = newProject
        }

        if (this.checkTimeoutRef != null)
            window.clearTimeout(this.checkTimeoutRef);
        this.checkTimeoutRef = window.setTimeout(() => this.check(), 700);
    }

    changeTownCamera(townCamera: TownCamera) {
        this._townCamera = townCamera;
    }

    changeSettings(settings: Settings) {
        this._project = this._project.withSettings(settings);
    }

    provideCompletionItems(line: number, column: number): CompletionItem[] {
        const languageService = new LanguageService(this.project.compilation);
        return languageService.getCompletionItemsAt(this.selectedCodeFile!.compilationUnit, line, column);
    }

    private check() {
        this.checkTimeoutRef = null;
        this._errors = Checker.check(this.project.compilation);
        this._errorsInCurrentCodeFile = this._errors.filter(e => e.compilationUnit === this._selectedCodeFile?.compilationUnit);
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