import { EndOfFilePrimitiveToken } from "../syntax-tree/tokens/end-of-file-token";
import { IdentifierPrimitiveToken } from "../syntax-tree/tokens/identifier-token";
import { SkippedTokenTrivia } from "../syntax-tree/trivia/skipped-token-trivia";
import { FullParserContext } from "./full-parser-context";

describe("FullParserContext", () => {
    it("constructor - Throws an error if the last token is not EndOfFilePrimitiveToken.", () => {
        const tokens = [
            new IdentifierPrimitiveToken("aaa")
        ];
        expect(() => new FullParserContext(tokens)).toThrowMatching(e => e instanceof Error);
    });

    it("current - Is the first token of the passed tokens after an instance creation.", () => {
        const tokens = [
            new IdentifierPrimitiveToken("aaa"),
            new IdentifierPrimitiveToken("bbb"),
            new EndOfFilePrimitiveToken("")
        ]
        const context = new FullParserContext(tokens);

        expect(context.current).toBe(tokens[0]);
    });

    it("goNext - Moves the context by one token.", () => {
        const tokens = [
            new IdentifierPrimitiveToken("aaa"),
            new IdentifierPrimitiveToken("bbb"),
            new IdentifierPrimitiveToken("ccc"),
            new EndOfFilePrimitiveToken("")
        ];
        const context = new FullParserContext(tokens);
        context.goNext();

        expect(context.current).toBe(tokens[1]);
    });

    it("goNext - Throws an error when the context is at the last token.", () => {
        const tokens = [
            new IdentifierPrimitiveToken("aaa"),
            new EndOfFilePrimitiveToken("")
        ]
        const context = new FullParserContext(tokens);
        context.goNext();

        expect(() => context.goNext()).toThrowMatching(e => e instanceof Error);
    });

    it("skip - Moves the context and assigns skipped tokens to the next token leading trivia.", () => {
        const tokens = [
            new IdentifierPrimitiveToken("aaa"),
            new IdentifierPrimitiveToken("bbb"),
            new IdentifierPrimitiveToken("ccc"),
            new EndOfFilePrimitiveToken("")
        ];
        const context = new FullParserContext(tokens);
        context.skip();
        context.skip();

        expect(context.current).toEqual(new IdentifierPrimitiveToken("ccc", [
            new SkippedTokenTrivia(tokens[0]),
            new SkippedTokenTrivia(tokens[1])
        ]));
    });

    it("skip - Throws an error when the context is at the last token.", () => {
        const tokens = [
            new IdentifierPrimitiveToken("aaa"),
            new EndOfFilePrimitiveToken("")
        ]
        const context = new FullParserContext(tokens);
        context.goNext();

        expect(() => context.skip()).toThrowMatching(e => e instanceof Error);
    });
});
