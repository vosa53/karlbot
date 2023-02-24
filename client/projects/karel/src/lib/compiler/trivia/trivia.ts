/**
 * Trivia.
 */
export abstract class Trivia {
    /**
     * Text content.
     */
    readonly text: string;
    
    /**
     * @param text Text content. 
     */
    constructor(text: string) {
        this.text = text;
    }

    equals(other: Trivia) {
        return this.constructor === other.constructor && this.text === other.text;
    }
}