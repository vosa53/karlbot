import { Instruction } from './instruction';

export class StoreInstruction extends Instruction {
    constructor(readonly localIndex: number) {
        super();
    }
}