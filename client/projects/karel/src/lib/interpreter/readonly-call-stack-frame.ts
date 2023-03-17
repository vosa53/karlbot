import { Instruction } from "../../public-api";
import { Program } from "../assembly/program";

export interface ReadonlyCallStackFrame {
    /**
     * Program.
     */
    readonly program: Program

    /**
     * Evaluation stack.
     */
    readonly evaluationStack: readonly number[];

    /**
     * Index of current instruction (next to be processed).
     */
    readonly currentInstructionIndex: number;

    /**
     * Variables.
     */
    readonly variables: readonly number[];

    /**
     * Current instruction.
     */
    readonly currentInstruction: Instruction;
} 