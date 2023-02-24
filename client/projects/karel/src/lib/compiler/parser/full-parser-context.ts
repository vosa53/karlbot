import { EndOfFilePrimitiveToken } from "../primitive-tokens/end-of-file-primitive-token";
import { PrimitiveToken } from "../primitive-tokens/primitive-token";
import { SkippedTokenTrivia } from "../trivia/skipped-token-trivia";
import { ParserContext } from "./parser-context";

export class FullParserContext implements ParserContext {
    get hasCurrent(): boolean {
        return this.currentIndex < this.tokens.length - 1;
    }

    get current(): PrimitiveToken {
        const hasCurrent = this.currentIndex < this.tokens.length - 1;
        return this._current;
    }

    private readonly tokens: PrimitiveToken[];
    private currentIndex: number;
    private readonly skippedTokens: SkippedTokenTrivia[];
    private _current: PrimitiveToken;

    constructor(tokens: PrimitiveToken[]) {
        if (tokens.length === 0 || !(tokens[tokens.length - 1] instanceof EndOfFilePrimitiveToken))
            throw new Error("Last token must be a EndOfFilePrimitiveToken.");

        this.tokens = tokens;
        this.currentIndex = 0;
        this.skippedTokens = [];
        this._current = tokens[0];
    }

    goNext() {
        this.skippedTokens.length = 0;
        this.currentIndex++;
        this.updateCurrent();
    }

    skip() {
        if (this.hasCurrent) {
            const skippedToken = new SkippedTokenTrivia(this.tokens[this.currentIndex]);
            this.skippedTokens.push(skippedToken);
        }
        this.currentIndex++;
        this.updateCurrent();
    }

    private updateCurrent() {
        if (this.currentIndex < this.tokens.length) {
            this._current = this.tokens[this.currentIndex];

            if (this.skippedTokens.length > 0)
                this._current = this._current.with({ leadingTrivia: [...this.skippedTokens, ...this._current.leadingTrivia] });
        }
    }
}