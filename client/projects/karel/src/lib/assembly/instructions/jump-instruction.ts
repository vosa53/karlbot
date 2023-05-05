import { Instruction } from "./instruction";

/**
 * Instruction to jump to the given instruction index.
 */
export class JumpInstruction extends Instruction {
    /**
     * @param instructionIndex Index of the instruction to jump to.
     */
    constructor(readonly instructionIndex: number) {
        super();
    }
}