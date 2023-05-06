/**
 * Represents a text that has no meaning for a parser and so is not a direct part of any token.
 * 
 * Idea from Roslyn compiler: https://github.com/jasonmalinowski/roslyn-wiki/blob/master/FAQ.md#how-are-comments-stored-in-the-syntax-tree-and-how-to-use-the-syntax-visualizer.
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
        if (text === "")
            throw new Error("Trivia text can not be empty.");
        
        this.text = text;
    }

    /**
     * Returns `true` when this and other are equal. `false` otherwise.
     * @param other Other.
     */
    equals(other: Trivia) {
        return this.constructor === other.constructor && this.text === other.text;
    }
}