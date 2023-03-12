import { EndOfFilePrimitiveToken } from "../syntax-tree/tokens/end-of-file-token";
import { PrimitiveToken } from "../syntax-tree/tokens/token";

/**
 * Processing context for a stream of tokens passed to a parser.
 */
export interface ParserContext {
    /**
     * Current token or {@link EndOfFilePrimitiveToken} if the context is at the end of the stream.
     * 
     * Starts at the first token of the stream.
     */
    readonly current: PrimitiveToken;

    /**
     * Proceeds to the next token. If the context is at the last token it throws an error.
     */
    goNext(): void;

    /**
     * Proceeds to the next token and the current token assigns as a skipped token trivia to the next token leading trivia. If the context is at the last token it throws an error.
     */
    skip(): void;
}