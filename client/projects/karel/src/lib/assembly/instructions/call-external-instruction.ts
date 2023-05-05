import { Instruction } from "./instruction";

/**
 * Instruction to call an external program.
 */
export class CallExternalInstruction extends Instruction {
    /**
     * @param name Name of the external program to be called.
     */
    constructor(readonly name: string) {
        super();
    }
}