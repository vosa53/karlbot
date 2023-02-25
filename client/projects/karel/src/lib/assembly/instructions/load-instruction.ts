import { Instruction } from './instruction';

export class LoadInstruction extends Instruction {
    constructor(readonly localIndex: number) {
        super();
    }
}