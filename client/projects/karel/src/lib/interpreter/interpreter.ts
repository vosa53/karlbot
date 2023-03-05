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

/**
 * Karel interpreter.
 */
export class Interpreter {
    /**
     * Maximum size of the call stack.
     */
    maxCallStackSize: number | null = null;

    /**
     * Call stack.
     */
    readonly callStack: CallStackFrame[] = [];

    /**
     * Current call stack frame.
     */
    get currentStackFrame(): CallStackFrame | null {
        if (this.callStack.length === 0)
            return null;

        return this.callStack[this.callStack.length - 1];
    }

    private readonly externalProgramMap = new Map<string, ExternalProgram>();

    /**
     * Adds an external program.
     * @param externalProgram External program to add.
     */
    addExternalProgram(externalProgram: ExternalProgram) {
        if (this.externalProgramMap.has(externalProgram.name))
            throw new Error();

        this.externalProgramMap.set(externalProgram.name, externalProgram);
    }

    /**
     * Removes an external program.
     * @param externalProgram External program to remove.
     */
    removeExternalProgram(externalProgram: ExternalProgram) {
        const matchingExternalProgram = this.externalProgramMap.get(externalProgram.name);

        if (matchingExternalProgram === externalProgram)
            this.externalProgramMap.delete(externalProgram.name);
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
     * @returns 
     */
    async interpretSingle(stopToken: InterpretStopToken): Promise<InterpretResult> {
        let interpretedCount = 0;
        return this.interpretWhile(() => interpretedCount++ !== 1, stopToken);
    }

    private async interpretWhile(predicate: () => boolean, stopToken: InterpretStopToken): Promise<InterpretResult> {
        while (this.currentStackFrame !== null && predicate()) {
            if (stopToken.isStopRequested)
                return new StopInterpretResult();

            let result = this.interpretCurrent(stopToken);
            if (result instanceof Promise)
                result = await result;

            if (result instanceof Exception) {
                this.callStack.length = 0;
                return new ExceptionInterpretResult(result);
            }
        }

        return new NormalInterpretResult();
    }

    private interpretCurrent(stopToken: InterpretStopToken): void | Exception | Promise<void | Exception> {
        while (this.currentStackFrame !== null && this.currentStackFrame.currentInstructionIndex >= this.currentStackFrame.program.instructions.length)
            this.callStack.pop();

        if (this.currentStackFrame !== null) {
            const instruction = this.currentStackFrame.currentInstruction;
            this.currentStackFrame.currentInstructionIndex++;

            return this.interpret(instruction, stopToken);
        }
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
        if (this.currentStackFrame === null)
            throw new Error();
        if (this.currentStackFrame.evaluationStack!.length < 2)
            throw new Error();

        const numberA = this.currentStackFrame.evaluationStack.pop()!;
        const numberB = this.currentStackFrame.evaluationStack.pop()!;
        const result = numberA + numberB;
        this.currentStackFrame.evaluationStack.push(result);
    }

    private async interpretCallExternal(instruction: CallExternalInstruction, stopToken: InterpretStopToken): Promise<void | Exception> {
        const externalProgram = this.externalProgramMap.get(instruction.name);
        if (externalProgram === undefined)
            throw new Error();

        let result = externalProgram.handler(this, stopToken);
        if (result instanceof Promise)
            result = await result;

        if (result instanceof Exception)
            return result;

        if (typeof (result) === "number" && this.currentStackFrame !== null)
            this.currentStackFrame.evaluationStack.push(result);
    }

    private interpretCall(instruction: CallInstruction): void | Exception {
        const newStackFrame = new CallStackFrame(instruction.program);
        this.callStack.push(newStackFrame);

        if (this.maxCallStackSize !== null && this.callStack.length > this.maxCallStackSize)
            return new Exception("Stack overflow.");
    }

    private interpretCompareGreater(instruction: CompareGreaterInstruction) {
        if (this.currentStackFrame === null)
            throw new Error();
        if (this.currentStackFrame.evaluationStack.length < 2)
            throw new Error();

        const numberA = this.currentStackFrame.evaluationStack.pop()!;
        const numberB = this.currentStackFrame.evaluationStack.pop()!;
        const result = numberA < numberB;
        const resultNumber = result ? 1 : 0;
        this.currentStackFrame.evaluationStack.push(resultNumber);
    }

    private interpretJumpIfFalse(instruction: JumpIfFalseInstruction) {
        if (this.currentStackFrame === null)
            throw new Error();
        if (this.currentStackFrame.evaluationStack.length === 0)
            throw new Error();

        const number = this.currentStackFrame.evaluationStack.pop()!;
        if (number === 0)
            this.currentStackFrame.currentInstructionIndex = instruction.instructionIndex;
    }

    private interpretJumpIfTrue(instruction: JumpIfTrueInstruction) {
        if (this.currentStackFrame === null)
            throw new Error();
        if (this.currentStackFrame.evaluationStack.length === 0)
            throw new Error();

        const number = this.currentStackFrame.evaluationStack.pop()!;
        if (number === 1)
            this.currentStackFrame.currentInstructionIndex = instruction.instructionIndex;
    }

    private interpretJump(instruction: JumpInstruction) {
        if (this.currentStackFrame === null)
            throw new Error();

        this.currentStackFrame.currentInstructionIndex = instruction.instructionIndex;
    }

    private interpretLoad(instruction: LoadInstruction) {
        if (this.currentStackFrame === null)
            throw new Error();
        if (this.currentStackFrame.variables.length <= instruction.localIndex)
            throw new Error();

        const localValue = this.currentStackFrame.variables[instruction.localIndex];
        this.currentStackFrame.evaluationStack.push(localValue);
    }

    private interpretPop(instruction: PopInstruction) {
        if (this.currentStackFrame === null)
            throw new Error();
        if (this.currentStackFrame.evaluationStack.length === 0)
            throw new Error();

        this.currentStackFrame.evaluationStack.pop();
    }

    private interpretPush(instruction: PushInstruction) {
        if (this.currentStackFrame === null)
            throw new Error();

        this.currentStackFrame.evaluationStack.push(instruction.value);
    }

    private interpretStore(instruction: StoreInstruction) {
        if (this.currentStackFrame === null)
            throw new Error();
        if (this.currentStackFrame.evaluationStack.length === 0)
            throw new Error();
        if (this.currentStackFrame.variables.length <= instruction.localIndex)
            throw new Error();

        const number = this.currentStackFrame.evaluationStack.pop()!;
        this.currentStackFrame.variables[instruction.localIndex] = number;
    }
}