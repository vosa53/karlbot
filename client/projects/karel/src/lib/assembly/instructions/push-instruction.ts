import { Instruction } from './instruction';

export class PushInstruction extends Instruction {
    constructor(readonly value: number) {
        super();
    }
}