import { LineTextRange } from "../line-text-range";

export class SyntaxError {
    readonly message: string;
    readonly textRange: LineTextRange;

    constructor(message: string, textRange: LineTextRange) {
        this.message = message;
        this.textRange = textRange;
    }
}