/**
 * Processing context for a stream of characters passed to a lexer.
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
     * Proceeds to the next character or to the end. If the context is already at the end it throws an error.
     */
    goNext(): void;

    /**
     * Returns a string of already processed characters (excluding the current one) that were not collected yet.
     */
    collect(): string;
}
