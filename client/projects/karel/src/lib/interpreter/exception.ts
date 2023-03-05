/**
 * Intepreter exception
 */
export class Exception {
    /**
     * Message.
     */
    readonly message: string;

    /**
     * @param message Message.
     */
    constructor(message: string) {
        this.message = message;
    }
}