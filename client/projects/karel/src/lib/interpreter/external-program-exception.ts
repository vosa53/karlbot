/**
 * External program exception
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