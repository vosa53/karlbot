import { Instruction } from './instruction';
import { Program } from '../program';

export class CallInstruction extends Instruction {
    constructor(readonly program: Program) {
        super();
    }
}