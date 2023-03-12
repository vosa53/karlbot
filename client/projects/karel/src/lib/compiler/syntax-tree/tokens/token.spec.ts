import { SyntaxError } from "../../errors/syntax-error";
import { LineTextRange } from "../../line-text-range";
import { Node } from "../nodes/node";
import { Token } from "../tokens/token";
import { EndOfLineTrivia } from "../trivia/end-of-line-trivia";
import { InvalidCharactersTrivia } from "../trivia/invalid-characters-trivia";
import { MultilineCommentTrivia } from "../trivia/multiline-comment-trivia";
import { SinglelineCommentTrivia } from "../trivia/singleline-comment-trivia";
import { SkippedTokenTrivia } from "../trivia/skipped-token-trivia";
import { Trivia } from "../trivia/trivia";
import { WhitespaceTrivia } from "../trivia/whitespace-trivia";
import { PrimitiveToken } from "./token";

describe("PrimitiveToken", () => {
    it("text - Is a text only of the token itself without its trivia.", () => {
        const token = new TestPrimitiveToken("test", [new MultilineCommentTrivia("/*abc*/")], [new InvalidCharactersTrivia("!!")]);
        expect(token.text).toBe("test");
    });

    it("buildText - Creates text of the token including its leading and trailing trivia.", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "), 
            new InvalidCharactersTrivia("!!")
        ];
        const trailingTrivia = [
            new MultilineCommentTrivia("/*abc*/"), 
            new EndOfLineTrivia("\n")
        ];
        const token = new TestPrimitiveToken("test", leadingTrivia, trailingTrivia);

        expect(token.buildText()).toBe("    !!test/*abc*/\n");
    });

    it("textPosition - Is equal to the leading trivia total length.", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "),
            new EndOfLineTrivia("\r\n"),
            new InvalidCharactersTrivia("?!")
        ];
        const token = new TestPrimitiveToken("test", leadingTrivia);

        expect(token.textPosition).toBe(8);
    });

    it("textPosition - Is 0 when the token has no leading trivia.", () => {
        const token = new TestPrimitiveToken("test");

        expect(token.textPosition).toBe(0);
    });

    it("textStartLine - Is equal to the leading trivia line count.", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "),
            new EndOfLineTrivia("\n"),
            new MultilineCommentTrivia("/*\n\n*/"),
            new InvalidCharactersTrivia("?!"),
        ];
        const token = new TestPrimitiveToken("test", leadingTrivia);

        expect(token.textStartLine).toBe(4);
    });

    it("textStartLine - Is 1 when the token has no leading trivia.", () => {
        const token = new TestPrimitiveToken("test");

        expect(token.textStartLine).toBe(1);
    });

    it("textStartColumn - Is equal to the leading trivia last line length + 1.", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "),
            new EndOfLineTrivia("\n"),
            new MultilineCommentTrivia("/*\n\n*/"),
            new InvalidCharactersTrivia("?!"),
        ];
        const token = new TestPrimitiveToken("test", leadingTrivia);

        expect(token.textStartColumn).toBe(5);
    });

    it("textStartColumn - Is 1 when the token has no leading trivia.", () => {
        const token = new TestPrimitiveToken("test");

        expect(token.textStartColumn).toBe(1);
    });

    it("textEndLine - Is equal to the total line count of the leading trivia and the token itself. ", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "),
            new EndOfLineTrivia("\n"),
            new MultilineCommentTrivia("/*\n\n*/"),
            new InvalidCharactersTrivia("?!"),
        ];
        const token = new TestPrimitiveToken("te\nst", leadingTrivia);

        expect(token.textEndLine).toBe(5);
    });

    it("textEndLine - Is equal to the total line count of the token itself when the token has no leading trivia.", () => {
        const token = new TestPrimitiveToken("te\nst");

        expect(token.textEndLine).toBe(2);
    });

    it("textEndColumn - Is equal to the last line length of the leading trivia and the token itself + 1.", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "),
            new EndOfLineTrivia("\n"),
            new MultilineCommentTrivia("/*\n\n*/"),
            new InvalidCharactersTrivia("?!"),
        ];
        const token = new TestPrimitiveToken("test", leadingTrivia);

        expect(token.textEndColumn).toBe(9);
    });

    it("textEndColumn - Is equal to the last line length of the token itself when the token has no leading trivia.", () => {
        const token = new TestPrimitiveToken("te\nst");

        expect(token.textEndColumn).toBe(3);
    });

    it("length - Is equal to the total character length of the trivia and the token itself.", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "),
            new EndOfLineTrivia("\r\n")
        ];
        const trailingTrivia = [
            new InvalidCharactersTrivia("???")
        ];
        const token = new TestPrimitiveToken("test", leadingTrivia, trailingTrivia);

        expect(token.length).toBe(13);
    });

    it("length - Is equal to the character length of the token itself when the token has no trivia.", () => {
        const token = new TestPrimitiveToken("te\nst");

        expect(token.length).toBe(5);
    });

    it("lineCount - Is equal to the total line count of the trivia and the token itself.", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "),
            new EndOfLineTrivia("\n")
        ];
        const trailingTrivia = [
            new MultilineCommentTrivia("/*aaa\nbbb\n*/")
        ];
        const token = new TestPrimitiveToken("te\nst", leadingTrivia, trailingTrivia);

        expect(token.lineCount).toBe(5);
    });

    it("lineCount - Is equal to the total line count of the token itself when the token has no trivia.", () => {
        const token = new TestPrimitiveToken("te\nst");

        expect(token.lineCount).toBe(2);
    });

    it("lastLineLength - Is equal to the last line length of the trivia and the token itself.", () => {
        const leadingTrivia = [
            new EndOfLineTrivia("aaa\n"),
            new WhitespaceTrivia("    ")
        ];
        const trailingTrivia = [
            new SinglelineCommentTrivia("// abc")
        ];
        const token = new TestPrimitiveToken("test", leadingTrivia, trailingTrivia);

        expect(token.lastLineLength).toBe(14);
    });

    it("lastLineLength - Is equal to the last line length of the token itself when the token has no trivia.", () => {
        const token = new TestPrimitiveToken("te\nst\nabc");

        expect(token.lastLineLength).toBe(3);
    });

    it("syntaxErrors - SkippedTokenTrivia creates a syntax error.", () => {
        const token = new TestPrimitiveToken("test, ", [new SkippedTokenTrivia(new TestPrimitiveToken("abc"))]);

        expect(token.syntaxErrors).toEqual([
            new SyntaxError("Skipped token", new LineTextRange(1, 1, 1, 4))
        ]);
    });

    it("syntaxErrors - InvalidCharactersTrivia creates a syntax error.", () => {
        const token = new TestPrimitiveToken("test, ", [new InvalidCharactersTrivia("?_!!_")]);

        expect(token.syntaxErrors).toEqual([
            new SyntaxError("Invalid characters", new LineTextRange(1, 1, 1, 6))
        ]);
    });

    it("syntaxErrors - Have a correct textRange.", () => {
        const leadingTrivia = [
            new WhitespaceTrivia("    "),
            new SkippedTokenTrivia(new TestPrimitiveToken("a\nbc")),
        ];
        const trailingTrivia = [
            new MultilineCommentTrivia("/*def\n*/"),
            new InvalidCharactersTrivia("?!_"),
        ];
        const token = new TestPrimitiveToken("te\nst, ", leadingTrivia, trailingTrivia);

        expect(token.syntaxErrors).toEqual([
            new SyntaxError("Skipped token", new LineTextRange(1, 5, 2, 3)),
            new SyntaxError("Invalid characters", new LineTextRange(4, 3, 4, 6))
        ]);
    });

    it("textStartLine, textStartColumn, textEndLine, textEndColumn, lineCount, lastLineLength, syntaxErrors - Different line ending types (CRLF, CR, LF) can be combined.", () => {
        const leadingTrivia = [
            new EndOfLineTrivia("\n"),
            new MultilineCommentTrivia("/*\r\n\n\r*/"),
            new InvalidCharactersTrivia("!!!"),
        ];
        const trailingTrivia = [
            new MultilineCommentTrivia("/*\r*/"),
            new SkippedTokenTrivia(new TestPrimitiveToken("a\r\nb")),
        ];
        const token = new TestPrimitiveToken("te\nst", leadingTrivia, trailingTrivia);

        expect(token.textStartLine).toBe(5);
        expect(token.textStartColumn).toBe(6);
        expect(token.textEndLine).toBe(6);
        expect(token.textEndColumn).toBe(3);
        expect(token.lineCount).toBe(8);
        expect(token.lastLineLength).toBe(1);
        expect(token.syntaxErrors).toEqual([
            new SyntaxError("Invalid characters", new LineTextRange(5, 3, 5, 6)),
            new SyntaxError("Skipped token", new LineTextRange(7, 3, 8, 2))
        ]);
    });
});

class TestPrimitiveToken extends PrimitiveToken {
    createWrapper(parent: Node, position: number, startLine: number, startColumn: number): Token {
        throw new Error("Not supported.");
    }

    with(newProperties: { text?: string | undefined; leadingTrivia?: Trivia[] | undefined; trailingTrivia?: Trivia[] | undefined; }): PrimitiveToken {
        throw new Error("Not supported.");
    }
}