import { Instruction } from './instruction';

export class JumpIfTrueInstruction extends Instruction {
    constructor(readonly instructionIndex: number) {
        super();
    }
}