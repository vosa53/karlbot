import { LexerContext } from "./lexer-context";

/**
 * {@link LexerContext} created from a previously known string.
 */
export class FullLexerContext implements LexerContext {
    get current(): string | null {
        const hasCurrent = this.currentIndex < this.text.length;
        if (hasCurrent)
            return this.text[this.currentIndex];
        else
            return null;
    }

    get next(): string | null {
        const hasNext = this.currentIndex + 1 < this.text.length;
        if (hasNext)
            return this.text[this.currentIndex + 1];
        else
            return null;
    }

    private readonly text: string;
    private currentIndex: number;
    private collectStartIndex: number;

    /**
     * @param text Text.
     */
    constructor(text: string) {
        this.text = text;
        this.currentIndex = 0;
        this.collectStartIndex = 0;
    }

    goNext() {
        if (this.currentIndex >= this.text.length)
            throw new Error("The context has already reached the end.");

        this.currentIndex++;
    }

    collect(): string {
        const collected = this.text.slice(this.collectStartIndex, this.currentIndex);
        this.collectStartIndex = this.currentIndex;

        return collected;
    }
}
