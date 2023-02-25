import { Instruction } from './instruction';

/**
 * Instruction to push the local variable value on the evaluation stack.
 */
export class LoadInstruction extends Instruction {
    /**
     * @param localIndex Index of the local variable which value is to be pushed on the evaluation stack.
     */
    constructor(readonly localIndex: number) {
        super();
    }
}