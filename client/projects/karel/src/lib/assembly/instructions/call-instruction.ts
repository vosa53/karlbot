import { Instruction } from './instruction';
import { Program } from '../program';

/**
 * Instruction to call an internal program.
 */
export class CallInstruction extends Instruction {
    /**
     * @param program Program to be called.
     */
    constructor(readonly program: Program) {
        super();
    }
}