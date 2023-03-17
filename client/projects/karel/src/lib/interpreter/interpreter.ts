import { CallStackFrame } from './call-stack-frame';
import { Instruction } from '../assembly/instructions/instruction';
import { CallExternalInstruction } from '../assembly/instructions/call-external-instruction';
import { CallInstruction } from '../assembly/instructions/call-instruction';
import { JumpIfFalseInstruction } from '../assembly/instructions/jump-if-false-instruction';
import { JumpIfTrueInstruction } from '../assembly/instructions/jump-if-true-instruction';
import { JumpInstruction } from '../assembly/instructions/jump-instruction';
import { LoadInstruction } from '../assembly/instructions/load-instruction';
import { PopInstruction } from '../assembly/instructions/pop-instruction';
import { PushInstruction } from '../assembly/instructions/push-instruction';
import { StoreInstruction } from '../assembly/instructions/store-instruction';
import { ExternalProgram } from './external-program';
import { AddInstruction } from '../assembly/instructions/add-instruction';
import { CompareGreaterInstruction } from '../assembly/instructions/compare-greater-instruction';
import { Exception } from './exception';
import { InterpretStopToken } from './interpret-stop-token';
import { ExceptionInterpretResult } from './results/exception-interpret-result';
import { StopInterpretResult } from './results/stop-interpret-result';
import { NormalInterpretResult } from './results/normal-interpret-result';
import { InterpretResult } from './results/interpret-result';
import { ExternalProgramException } from './external-program-exception';
import { NoOperationInstruction } from '../assembly/instructions/no-operation-instruction';
import { BreakpointInterpretResult } from './results/breakpoint-interpret-result';
import { ReadonlyCallStackFrame } from './readonly-call-stack-frame';
import { Assembly } from '../assembly/assembly';
import { Program } from '../assembly/program';

/**
 * Karel interpreter.
 */
export class Interpreter {
    /**
     * Maximum size of the call stack.
     */
    maxCallStackSize: number | null = null;

    /**
     * Whether the breakpoint on the first instruction should be skipped.
     */
    skipBreakpointOnFirstInstruction: boolean = false;

    private readonly assembly: Assembly;
    private readonly nameToProgram: ReadonlyMap<string, Program>;
    private readonly nameToExternalProgram: ReadonlyMap<string, ExternalProgram>;
    
    private breakpoints = new Set<Instruction>();
    private callStack: CallStackFrame[] = [];

    private get callStackTop(): CallStackFrame | null {
        return this.callStack.length === 0 ? null : this.callStack[this.callStack.length - 1];
    }

    constructor(assembly: Assembly, entryPoint: Program, externalPrograms: ExternalProgram[]) {
        this.assembly = assembly;

        this.nameToProgram = new Map(assembly.programs.map(p => [p.name, p]));
        this.nameToExternalProgram = new Map(externalPrograms.map(ep => [ep.name, ep]));

        if (this.nameToProgram.get(entryPoint.name) !== entryPoint)
            throw new Error();

        this.callStack.push(new CallStackFrame(entryPoint));
    }

    /**
     * Sets breakpoints on the given instructions.
     * @param instructions Instructions on which the breakpoints are to be set.
     */
    setBreakpoints(instructions: Iterable<Instruction>) {
        this.breakpoints = new Set(instructions);
    }

    /**
     * Returns a readonly version of the call stack.
     */
    getCallStack(): readonly ReadonlyCallStackFrame[] {
        return this.callStack;
    }

    /**
     * Interprets all instructions.
     * @param stopToken Token to stop the intepretation.
     */
    async interpretAll(stopToken: InterpretStopToken): Promise<InterpretResult> {
        return this.interpretWhile(() => true, stopToken);
    }

    /**
     * Interprets a single instruction.
     * @param stopToken Token to stop the intepretation.
     */
    async interpretSingle(stopToken: InterpretStopToken): Promise<InterpretResult> {
        return this.interpretWhile(interpretedCount => interpretedCount === 0, stopToken);
    }

    /**
     * Interprets instructions until a new source range is reached.
     * @param stopToken Token to stop the intepretation.
     */
    async interpretStepInto(stopToken: InterpretStopToken): Promise<InterpretResult> {
        if (this.callStackTop === null)
            return this.interpretWhile(() => false, stopToken);

        const startSourceRange = this.assembly.sourceMap.getRangeByInstruction(this.callStackTop.currentInstruction);
        return this.interpretWhile(() => {
            return this.assembly.sourceMap.getRangeByInstruction(this.callStackTop!.currentInstruction).equals(startSourceRange);
        }, stopToken);
    }

    /**
     * Interprets instructions until a new source range in the current program is reached. 
     * @param stopToken Token to stop the intepretation.
     */
    async interpretStepOver(stopToken: InterpretStopToken): Promise<InterpretResult> {
        if (this.callStackTop === null)
            return this.interpretWhile(() => false, stopToken);

        const startCallStackLength = this.callStack.length;
        const startSourceRange = this.assembly.sourceMap.getRangeByInstruction(this.callStackTop.currentInstruction);
        return this.interpretWhile(() => {
            return this.callStack.length > startCallStackLength ||
                this.assembly.sourceMap.getRangeByInstruction(this.callStackTop!.currentInstruction).equals(startSourceRange);
        }, stopToken);
    }

    /**
     * Interprets instructions until the end of the current program.
     * @param stopToken Token to stop the intepretation.
     */
    async interpretStepOut(stopToken: InterpretStopToken): Promise<InterpretResult> {
        if (this.callStackTop === null)
            return this.interpretWhile(() => false, stopToken);
        
        const startCallStackLength = this.callStack.length;
        return this.interpretWhile(() => this.callStack.length >= startCallStackLength, stopToken);
    }

    private async interpretWhile(predicate: (interpretedCount: number) => boolean, stopToken: InterpretStopToken): Promise<InterpretResult> {
        let interpretedCount = 0;
        while (this.callStackTop !== null && predicate(interpretedCount)) {
            if (stopToken.isStopRequested)
                return new StopInterpretResult();

            if (this.breakpoints.has(this.callStackTop.currentInstruction) && (interpretedCount !== 0 || !this.skipBreakpointOnFirstInstruction))
                return new BreakpointInterpretResult();

            let result = this.interpretCurrent(stopToken);
            if (result instanceof Promise)
                result = await result;

            if (result instanceof Exception)
                return new ExceptionInterpretResult(result);

            interpretedCount++;
        }

        return new NormalInterpretResult();
    }

    private interpretCurrent(stopToken: InterpretStopToken): void | Exception | Promise<void | Exception> {
        if (this.callStackTop === null)
            throw new Error();

        const instruction = this.callStackTop.currentInstruction;
        this.callStackTop.currentInstructionIndex++;

        let result: void | Exception | Promise<void | Exception>;
        result = this.interpret(instruction, stopToken);
        while (this.callStackTop !== null && this.callStackTop.currentInstructionIndex >= this.callStackTop.program.instructions.length)
            this.callStack.pop();

        return result;
    }

    private interpret(instruction: Instruction, stopToken: InterpretStopToken): void | Exception | Promise<void | Exception> {
        if (instruction instanceof AddInstruction)
            this.interpretAdd(instruction);
        else if (instruction instanceof CallExternalInstruction)
            return this.interpretCallExternal(instruction, stopToken);
        else if (instruction instanceof CallInstruction)
            return this.interpretCall(instruction);
        else if (instruction instanceof CompareGreaterInstruction)
            this.interpretCompareGreater(instruction);
        else if (instruction instanceof JumpIfFalseInstruction)
            this.interpretJumpIfFalse(instruction);
        else if (instruction instanceof JumpIfTrueInstruction)
            this.interpretJumpIfTrue(instruction);
        else if (instruction instanceof JumpInstruction)
            this.interpretJump(instruction);
        else if (instruction instanceof LoadInstruction)
            this.interpretLoad(instruction);
        else if (instruction instanceof NoOperationInstruction)
            this.interpretNoOperation(instruction);
        else if (instruction instanceof PopInstruction)
            this.interpretPop(instruction);
        else if (instruction instanceof PushInstruction)
            this.interpretPush(instruction);
        else if (instruction instanceof StoreInstruction)
            this.interpretStore(instruction);
        else
            throw new Error("Unknown instruction.");
    }

    private interpretAdd(instruction: AddInstruction) {
        if (this.callStackTop === null)
            throw new Error();
        if (this.callStackTop.evaluationStack!.length < 2)
            throw new Error();

        const numberA = this.callStackTop.evaluationStack.pop()!;
        const numberB = this.callStackTop.evaluationStack.pop()!;
        const result = numberA + numberB;
        this.callStackTop.evaluationStack.push(result);
    }

    private async interpretCallExternal(instruction: CallExternalInstruction, stopToken: InterpretStopToken): Promise<void | Exception> {
        const externalProgram = this.nameToExternalProgram.get(instruction.name);
        if (externalProgram === undefined)
            throw new Error();

        let result = externalProgram.handler(stopToken);
        if (result instanceof Promise)
            result = await result;

        if (result instanceof ExternalProgramException)
            return this.throwException(result.message);

        if (typeof (result) === "number" && this.callStackTop !== null)
            this.callStackTop.evaluationStack.push(result);
    }

    private interpretCall(instruction: CallInstruction): void | Exception {
        if (this.maxCallStackSize !== null && this.callStack.length >= this.maxCallStackSize)
            return this.throwException("Stack overflow.");

        const program = this.nameToProgram.get(instruction.name);
        if (program === undefined)
            throw new Error();

        this.callStack.push(new CallStackFrame(program));
    }

    private interpretCompareGreater(instruction: CompareGreaterInstruction) {
        if (this.callStackTop === null)
            throw new Error();
        if (this.callStackTop.evaluationStack.length < 2)
            throw new Error();

        const numberA = this.callStackTop.evaluationStack.pop()!;
        const numberB = this.callStackTop.evaluationStack.pop()!;
        const result = numberA < numberB;
        const resultNumber = result ? 1 : 0;
        this.callStackTop.evaluationStack.push(resultNumber);
    }

    private interpretJumpIfFalse(instruction: JumpIfFalseInstruction) {
        if (this.callStackTop === null)
            throw new Error();
        if (this.callStackTop.evaluationStack.length === 0)
            throw new Error();

        const number = this.callStackTop.evaluationStack.pop()!;
        if (number === 0)
            this.callStackTop.currentInstructionIndex = instruction.instructionIndex;
    }

    private interpretJumpIfTrue(instruction: JumpIfTrueInstruction) {
        if (this.callStackTop === null)
            throw new Error();
        if (this.callStackTop.evaluationStack.length === 0)
            throw new Error();

        const number = this.callStackTop.evaluationStack.pop()!;
        if (number === 1)
            this.callStackTop.currentInstructionIndex = instruction.instructionIndex;
    }

    private interpretJump(instruction: JumpInstruction) {
        if (this.callStackTop === null)
            throw new Error();

        this.callStackTop.currentInstructionIndex = instruction.instructionIndex;
    }

    private interpretLoad(instruction: LoadInstruction) {
        if (this.callStackTop === null)
            throw new Error();
        if (this.callStackTop.variables.length <= instruction.localIndex)
            throw new Error();

        const localValue = this.callStackTop.variables[instruction.localIndex];
        this.callStackTop.evaluationStack.push(localValue);
    }

    private interpretNoOperation(instruction: NoOperationInstruction) { }

    private interpretPop(instruction: PopInstruction) {
        if (this.callStackTop === null)
            throw new Error();
        if (this.callStackTop.evaluationStack.length === 0)
            throw new Error();

        this.callStackTop.evaluationStack.pop();
    }

    private interpretPush(instruction: PushInstruction) {
        if (this.callStackTop === null)
            throw new Error();

        this.callStackTop.evaluationStack.push(instruction.value);
    }

    private interpretStore(instruction: StoreInstruction) {
        if (this.callStackTop === null)
            throw new Error();
        if (this.callStackTop.evaluationStack.length === 0)
            throw new Error();
        if (this.callStackTop.variables.length <= instruction.localIndex)
            throw new Error();

        const number = this.callStackTop.evaluationStack.pop()!;
        this.callStackTop.variables[instruction.localIndex] = number;
    }

    private throwException(message: string): Exception {
        if (this.callStackTop === null)
            throw new Error();

        this.callStackTop.currentInstructionIndex--;
        const exception = new Exception(message, this.callStack);
        this.callStack = [];
        
        return exception;
    }
}