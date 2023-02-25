import { Instruction } from './instruction';

export class CallExternalInstruction extends Instruction {
    constructor(readonly name: string) {
        super();
    }
}