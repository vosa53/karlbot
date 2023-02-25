import { Instruction } from './instruction';

/**
 * Instruction to store the value from the top of the evaluation stack to the variable.
 */
export class StoreInstruction extends Instruction {
    /**
     * @param localIndex Index of the local variable where the value from the top of the evaluation stack is to be saved.
     */
    constructor(readonly localIndex: number) {
        super();
    }
}