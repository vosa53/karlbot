import { Instruction } from './instructions/instruction';

export class Program {
    name: string;
    readonly instructions: Instruction[];
    variableCount: number;

    constructor(name: string, instructions: Instruction[], variableCount: number) {
        this.name = name;
        this.instructions = instructions;
        this.variableCount = variableCount;
    }
}