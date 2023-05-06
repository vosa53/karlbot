import { Instruction } from "./instructions/instruction";

/**
 * Assembly program.
 */
export class Program {
    /**
     * Name.
     */
    readonly name: string;

    /**
     * Instructions.
     */
    readonly instructions: readonly Instruction[];

    /**
     * Count of used variables.
     */
    readonly variableCount: number;

    /**
     * @param name Name.
     * @param instructions Instructions.
     * @param variableCount Count of used variables.
     */
    constructor(name: string, instructions: Instruction[], variableCount: number) {
        this.name = name;
        this.instructions = instructions;
        this.variableCount = variableCount;
    }
}