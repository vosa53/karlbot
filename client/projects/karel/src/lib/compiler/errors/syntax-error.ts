import { LineTextRange } from "../line-text-range";

/**
 * Syntax error.
 */
export class SyntaxError {
    /**
     * Error message.
     */
    readonly message: string;

    /**
     * Text range to which the error is related.
     */
    readonly textRange: LineTextRange;

    /**
     * @param message Error message.
     * @param textRange Text range to which the error is related.
     */
    constructor(message: string, textRange: LineTextRange) {
        this.message = message;
        this.textRange = textRange;
    }
}