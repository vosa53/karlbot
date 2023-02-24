/**
 * Represents a processing context for a stream of characters passed to a lexer.
 */
export interface LexerContext {
    /**
     * Current character or `null` if the context is at the end of the stream.
     * 
     * Starts at the first character of the stream.
     */
    readonly current: string | null;

    /**
     * Next character.
     */
    readonly next: string | null;

    /**
     * Proceeds to the next character. If next character is not available it does nothing.
     */
    goNext(): void;


    collect(): string;
}
