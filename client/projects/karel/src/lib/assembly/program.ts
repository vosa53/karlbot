import { Instruction } from './instructions/instruction';

/**
 * Program.
 */
export class Program {
    /**
     * Name.
     */
    name: string;

    /**
     * Instructions.
     */
    readonly instructions: Instruction[];

    /**
     * Count of used variables.
     */
    variableCount: number;

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