/**
 * Represents a text that has no meaning for a parser and so is not a direct part of any token.
 */
export abstract class Trivia {
    /**
     * Text.
     */
    readonly text: string;
    
    /**
     * @param text Text. 
     */
    constructor(text: string) {
        this.text = text;
    }

    equals(other: Trivia) {
        return this.constructor === other.constructor && this.text === other.text;
    }
}