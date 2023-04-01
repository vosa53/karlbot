import { Injectable } from "@angular/core";
import { FileLineTextRange } from "dist/karel/lib/assembly/source-map";
import { Assembly } from "projects/karel/src/lib/assembly/assembly";
import { Emitter } from "projects/karel/src/lib/compiler/code-generation/emitter";
import { InterpretStopToken } from "projects/karel/src/lib/interpreter/interpret-stop-token";
import { Interpreter } from "projects/karel/src/lib/interpreter/interpreter";
import { ReadonlyCallStackFrame } from "projects/karel/src/lib/interpreter/readonly-call-stack-frame";
import { StandardLibrary } from "projects/karel/src/lib/standard-library/standard-library";
import { Checker, CodeFile, ExceptionInterpretResult, Instruction, InterpretResult, MutableTown, NormalInterpretResult, Project, StopInterpretResult } from "projects/karel/src/public-api";
import { BehaviorSubject, combineLatest, firstValueFrom, map } from "rxjs";
import { DialogService } from "../../../shared/presentation/services/dialog.service";
import { ProjectEditorService } from "./project-editor.service";

@Injectable()
export class RunService {
    private readonly interpreter = new BehaviorSubject<Interpreter | null>(null);
    private readonly interpretStopToken = new BehaviorSubject<InterpretStopToken | null>(null);
    private readonly callStack = new BehaviorSubject<readonly ReadonlyCallStackFrame[] | null>(null);
    private readonly currentRange = new BehaviorSubject<FileLineTextRange | null>(null);

    readonly callStack$ = this.callStack.asObservable();

    readonly state$ = combineLatest([this.interpreter, this.interpretStopToken]).pipe(map(([interpreter, interpretStopToken]) => {
        if (interpreter === null)
            return RunState.ready;
        else if (interpretStopToken !== null)
            return RunState.running;
        else
            return RunState.paused;
    }));

    private assembly: Assembly | null = null;
    private willPause = false;
    private isDebuggerStep = false;
    private karelSpeed = 0;

    constructor(private readonly projectEditorService: ProjectEditorService, private readonly dialogService: DialogService) {
        this.projectEditorService.project$.subscribe(p => {
            this.karelSpeed = p.settings.karelSpeed;
            if (this.interpreter.value !== null)
                this.interpreter.value.maxCallStackSize = p.settings.maxRecursionDepth;
        });
    }

    readonly currentRange$ = combineLatest([this.currentRange, this.projectEditorService.selectedCodeFile$]).pipe(map(([currentRange, selectedCodeFile]) => {
        if (currentRange === null || selectedCodeFile === null)
            return null;

        if (currentRange.filePath === selectedCodeFile.name)
            return currentRange.textRange;
        
        return null;
    }));

    async run(readonly: boolean): Promise<boolean> {
        const availableEntryPoints = await firstValueFrom(this.projectEditorService.availableEntryPoints$);
        const project = await firstValueFrom(this.projectEditorService.project$);
        const currentTown = await firstValueFrom(this.projectEditorService.currentTown$);

        const errors = Checker.check(project.compilation);
        if (errors.length !== 0) {
            await this.dialogService.showMessage("Errors", "Compilation contains errors.");
            return false;
        }
        if (!availableEntryPoints.includes(project.settings.entryPoint)) {
            await this.dialogService.showMessage("Error", "Select a valid entry point.");
            return false;
        }
        if (currentTown === null) {
            await this.dialogService.showMessage("Error", "Select a town.");
            return false;
        }

        const interpreter = this.createInterpreter(project, currentTown);
        this.interpreter.next(interpreter);
        this.setInterpreterBreakpoints(project);
        this._run(st => this.interpreter.value!.interpretAll(st));
        return true;
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
        this.interpreter.value!.skipBreakpointOnFirstInstruction = true;
        await this._run(st => this.interpreter.value!.interpretAll(st));
    }

    async stepInto() {
        await this.step(st => this.interpreter.value!.interpretStepInto(st));
    }

    async stepOver() {
        await this.step(st => this.interpreter.value!.interpretStepOver(st));
    }

    async stepOut() {
        await this.step(st => this.interpreter.value!.interpretStepOut(st));
    }

    async changeBreakpoints(breakpoints: readonly number[]) {
        const project = await firstValueFrom(this.projectEditorService.project$);

        if (this.interpreter.value !== null)
            this.setInterpreterBreakpoints(project);
    }

    private async step(action: (stopToken: InterpretStopToken) => Promise<InterpretResult>) {
        this.interpreter.value!.skipBreakpointOnFirstInstruction = true;
        this.isDebuggerStep = true;
        await this._run(action);
        this.isDebuggerStep = false;
    }

    private async _run(action: (stopToken: InterpretStopToken) => Promise<InterpretResult>) {
        await this.setCallStack(null);
        this.interpretStopToken.next(new InterpretStopToken());
        const result = await action(this.interpretStopToken.value!);

        this.interpretStopToken.next(null);
        const callStack = this.interpreter.value!.getCallStack();

        const isFullStop = result instanceof NormalInterpretResult && callStack.length === 0 || 
            result instanceof StopInterpretResult && !this.willPause;
        if (isFullStop) {
            await this.setReadyState();
        }
        else if (result instanceof ExceptionInterpretResult) {
            await this.setCallStack(result.exception.callStack);
            await this.dialogService.showMessage("Exception", result.exception.message);
        }
        else
            await this.setCallStack(callStack);
    }

    private async setReadyState() {
        this.interpreter.next(null);
        await this.setCallStack(null);
    }

    private async setCallStack(callStack: readonly ReadonlyCallStackFrame[] | null) {
        this.callStack.next(callStack);
        
        if (callStack !== null) {
            const project = await firstValueFrom(this.projectEditorService.project$);
            
            const currentInstruction = callStack[callStack.length - 1].currentInstruction;
            const currentRange = this.assembly!.sourceMap.getRangeByInstruction(currentInstruction);
            const currentFile = project.files.find(f => f.name === currentRange.filePath)!;
            
            this.projectEditorService.selectFile(currentFile);
            this.currentRange.next(currentRange);
        }
        else
            this.currentRange.next(null);

    }
    
    private setInterpreterBreakpoints(project: Project) {
        const breakpointInstructions: Instruction[] = [];
        
        for (const file of project.files) {
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

    private createInterpreter(project: Project, town: MutableTown): Interpreter {
        this.assembly = Emitter.emit(project.compilation);
        const entryPoint = this.assembly.programs.find(p => p.name === project.settings.entryPoint)!;
        const externalPrograms = StandardLibrary.getPrograms(town, () => this.isDebuggerStep ? 0 : this.karelSpeed);

        const interpreter = new Interpreter(this.assembly, entryPoint, externalPrograms);
        interpreter.maxCallStackSize = project.settings.maxRecursionDepth;
        interpreter.interpretedInstructionCountBeforeYield = 1000;
        interpreter.yieldFunction = () => new Promise(resolve => setTimeout(() => resolve(), 0));

        return interpreter;
    }
}

export enum RunState {
    ready = "ready",
    running = "running",
    paused = "paused"
}