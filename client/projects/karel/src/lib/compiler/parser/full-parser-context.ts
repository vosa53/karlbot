import { EndOfFilePrimitiveToken } from "../primitive-tokens/end-of-file-primitive-token";
import { PrimitiveToken } from "../primitive-tokens/primitive-token";
import { SkippedTokenTrivia } from "../trivia/skipped-token-trivia";
import { ParserContext } from "./parser-context";

/**
 * {@link LexerContext} created from a previously known tokens.
 */
export class FullParserContext implements ParserContext {
    get current(): PrimitiveToken {
        return this._current;
    }

    private readonly tokens: PrimitiveToken[];
    private readonly skippedTokenTrivia: SkippedTokenTrivia[];
    private currentIndex: number;
    private _current: PrimitiveToken;

    /**
     * @param tokens Tokens. The last token must be an {@link EndOfFilePrimitiveToken}.
     */
    constructor(tokens: PrimitiveToken[]) {
        if (tokens.length === 0 || !(tokens[tokens.length - 1] instanceof EndOfFilePrimitiveToken))
            throw new Error("Last token must be an EndOfFilePrimitiveToken.");

        this.tokens = tokens;
        this.skippedTokenTrivia = [];
        this.currentIndex = 0;
        this._current = this.createCurrent();
    }

    goNext() {
        this.throwIfLastToken();

        this.skippedTokenTrivia.length = 0;
        this.currentIndex++;
        this._current = this.createCurrent();
    }

    skip() {
        this.throwIfLastToken();

        const skippedTokenTrivia = new SkippedTokenTrivia(this.tokens[this.currentIndex]);
        this.skippedTokenTrivia.push(skippedTokenTrivia);
        this.currentIndex++;
        this._current = this.createCurrent();
    }

    private createCurrent(): PrimitiveToken {
        const current = this.tokens[this.currentIndex];

        if (this.skippedTokenTrivia.length === 0)
            return current;
        else
            return current.with({ leadingTrivia: [...this.skippedTokenTrivia, ...current.leadingTrivia] });
    }

    private throwIfLastToken() {
        if (this.currentIndex >= this.tokens.length - 1)
            throw new Error("The context has already reached the end.");
    }
}