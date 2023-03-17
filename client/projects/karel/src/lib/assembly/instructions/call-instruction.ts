import { Instruction } from './instruction';

/**
 * Instruction to call a program.
 */
export class CallInstruction extends Instruction {
    /**
     * @param name Name of the program to be called.
     */
    constructor(readonly name: string) {
        super();
    }
}