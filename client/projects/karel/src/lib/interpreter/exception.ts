import { ReadonlyCallStackFrame } from "./readonly-call-stack-frame";

/**
 * Intepreter exception
 */
export class Exception {
    /**
     * Message.
     */
    readonly message: string;

    /**
     * Call stack in the time when the exception was thrown.
     */
    readonly callStack: readonly ReadonlyCallStackFrame[];

    /**
     * @param message Message.
     * @param callStack Call stack in the time when the exception was thrown.
     */
    constructor(message: string, callStack: readonly ReadonlyCallStackFrame[]) {
        this.message = message;
        this.callStack = callStack;
    }
}