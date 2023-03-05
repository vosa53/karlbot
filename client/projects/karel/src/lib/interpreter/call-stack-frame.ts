import { Program } from '../assembly/program';
import { Instruction } from '../assembly/instructions/instruction';

/**
 * Call stack frame.
 */
export class CallStackFrame {
    /**
     * Program.
     */
    readonly program: Program

    /**
     * Evaluation stack.
     */
    readonly evaluationStack: number[] = [];

    /**
     * Index of current instruction (next to be processed).
     */
    currentInstructionIndex = 0;

    /**
     * Variables.
     */
    readonly variables: number[];

    /**
     * Current instruction.
     */
    get currentInstruction(): Instruction {
        return this.program.instructions[this.currentInstructionIndex];
    }

    /**
     * @param program Program.
     */
    constructor(program: Program) {
        this.program = program;
        this.variables = new Array(program.variableCount).fill(0);
    }
}