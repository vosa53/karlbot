import { Instruction } from './instruction';

export class JumpInstruction extends Instruction {
    constructor(readonly instructionIndex: number) {
        super();
    }
}