import { Instruction } from "./instruction";

/**
 * Instruction to jump to the given instruction index if the value on the top of the evaluation stack is true.
 */
export class JumpIfTrueInstruction extends Instruction {
    /**
     * @param instructionIndex Index of the instruction to jump to.
     */
    constructor(readonly instructionIndex: number) {
        super();
    }
}