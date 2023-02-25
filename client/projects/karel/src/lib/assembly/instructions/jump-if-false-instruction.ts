import { Instruction } from './instruction';

export class JumpIfFalseInstruction extends Instruction {
    constructor(readonly instructionIndex: number) {
        super();
    }
}