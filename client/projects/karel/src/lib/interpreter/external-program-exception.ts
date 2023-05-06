/**
 * Exception from an external program.
 */
export class ExternalProgramException {
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