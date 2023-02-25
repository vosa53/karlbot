import { Instruction } from './instruction';

/**
 * Instruction to push the value on the top of the evaluation stack.
 */
export class PushInstruction extends Instruction {
    /**
     * @param value Value to be pushed on the top of the evaluation stack.
     */
    constructor(readonly value: number) {
        super();
    }
}