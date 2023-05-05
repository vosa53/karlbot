import { ElsePrimitiveToken } from "../syntax-tree/tokens/else-token";
import { EndOfFilePrimitiveToken } from "../syntax-tree/tokens/end-of-file-token";
import { EndPrimitiveToken } from "../syntax-tree/tokens/end-token";
import { IdentifierPrimitiveToken } from "../syntax-tree/tokens/identifier-token";
import { IfPrimitiveToken } from "../syntax-tree/tokens/if-token";
import { IsPrimitiveToken } from "../syntax-tree/tokens/is-token";
import { NotPrimitiveToken } from "../syntax-tree/tokens/not-token";
import { NumberPrimitiveToken } from "../syntax-tree/tokens/number-token";
import { PrimitiveToken } from "../syntax-tree/tokens/token";
import { ProgramPrimitiveToken } from "../syntax-tree/tokens/program-token";
import { RepeatPrimitiveToken } from "../syntax-tree/tokens/repeat-token";
import { TimesPrimitiveToken } from "../syntax-tree/tokens/times-token";
import { WhilePrimitiveToken } from "../syntax-tree/tokens/while-token";
import { EndOfLineTrivia } from "../syntax-tree/trivia/end-of-line-trivia";
import { InvalidCharactersTrivia } from "../syntax-tree/trivia/invalid-characters-trivia";
import { MultilineCommentTrivia } from "../syntax-tree/trivia/multiline-comment-trivia";
import { SinglelineCommentTrivia } from "../syntax-tree/trivia/singleline-comment-trivia";
import { WhitespaceTrivia } from "../syntax-tree/trivia/whitespace-trivia";
import { FullLexerContext } from "./full-lexer-context";
import { Lexer } from "./lexer";

describe("Lexer", () => {
    describe("tokens", () => {
        describe("keywords", () => {
            it("tokenize - Tokenizes 'else' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("else");
                expect(tokens).toEqual([new ElsePrimitiveToken("else")]);
            });
        
            it("tokenize - Tokenizes 'end' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("end");
                expect(tokens).toEqual([new EndPrimitiveToken("end")]);
            });
        
            it("tokenize - Tokenizes 'if' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("if");
                expect(tokens).toEqual([new IfPrimitiveToken("if")]);
            });
        
            it("tokenize - Tokenizes 'is' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("is");
                expect(tokens).toEqual([new IsPrimitiveToken("is")]);
            });
        
            it("tokenize - Tokenizes 'not' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("not");
                expect(tokens).toEqual([new NotPrimitiveToken("not")]);
            });
        
            it("tokenize - Tokenizes 'program' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("program");
                expect(tokens).toEqual([new ProgramPrimitiveToken("program")]);
            });
        
            it("tokenize - Tokenizes 'repeat' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("repeat");
                expect(tokens).toEqual([new RepeatPrimitiveToken("repeat")]);
            });
        
            it("tokenize - Tokenizes 'times' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("times");
                expect(tokens).toEqual([new TimesPrimitiveToken("times")]);
            });
        
            it("tokenize - Tokenizes 'while' keyword.", () => {
                const tokens = tokenizeAllWithoutEnd("while");
                expect(tokens).toEqual([new WhilePrimitiveToken("while")]);
            });
        });

        describe("identifier", () => {
            it("tokenize - Tokenizes an identifier.", () => {
                const tokens = tokenizeAllWithoutEnd("step");
                expect(tokens).toEqual([new IdentifierPrimitiveToken("step")]);
            });

            it("tokenize - Tokenizes a mixed case identifier.", () => {
                const tokens = tokenizeAllWithoutEnd("IdeNtIFieR");
                expect(tokens).toEqual([new IdentifierPrimitiveToken("IdeNtIFieR")]);
            });

            it("tokenize - Tokenizes an identifier ending with number.", () => {
                const tokens = tokenizeAllWithoutEnd("someIdentifier123");
                expect(tokens).toEqual([new IdentifierPrimitiveToken("someIdentifier123")]);
            });
        });

        describe("number", () => {
            it("tokenize - Tokenizes a number.", () => {
                const tokens = tokenizeAllWithoutEnd("25");
                expect(tokens).toEqual([new NumberPrimitiveToken("25")]);
            });

            it("tokenize - Tokenizes number '0'.", () => {
                const tokens = tokenizeAllWithoutEnd("0");
                expect(tokens).toEqual([new NumberPrimitiveToken("0")]);
            });
        });
        
        it("tokenize - Tokenizes end of file.", () => {
            const tokens = tokenizeAll("");
            expect(tokens).toEqual([new EndOfFilePrimitiveToken("")]);
        });
    });

    describe("trivia", () => {
        describe("end of line", () => {
            it("tokenize - Tokenizes a LF end of line.", () => {
                const tokens = tokenizeAll("\n");
    
                expect(tokens).toEqual([new EndOfFilePrimitiveToken("", [
                    new EndOfLineTrivia("\n")
                ])]);
            });

            it("tokenize - Tokenizes a CR end of line.", () => {
                const tokens = tokenizeAll("\r");
    
                expect(tokens).toEqual([new EndOfFilePrimitiveToken("", [
                    new EndOfLineTrivia("\r")
                ])]);
            });

            it("tokenize - Tokenizes a CRLF end of line.", () => {
                const tokens = tokenizeAll("\r\n");
    
                expect(tokens).toEqual([new EndOfFilePrimitiveToken("", [
                    new EndOfLineTrivia("\r\n")
                ])]);
            });
        })
    
        it("tokenize - Tokenizes invalid characters.", () => {
            const tokens = tokenizeAll("?!.");

            expect(tokens).toEqual([new EndOfFilePrimitiveToken("", [
                new InvalidCharactersTrivia("?!.")
            ])]);
        });
    
        it("tokenize - Tokenizes multiline comment.", () => {
            const tokens = tokenizeAll("/*aaa*/");

            expect(tokens).toEqual([new EndOfFilePrimitiveToken("", [
                new MultilineCommentTrivia("/*aaa*/")
            ])]);
        });
    
        it("tokenize - Tokenizes singleline comment.", () => {
            const tokens = tokenizeAll("// Some comment");

            expect(tokens).toEqual([new EndOfFilePrimitiveToken("", [
                new SinglelineCommentTrivia("// Some comment")
            ])]);
        });
    
        it("tokenize - Tokenizes whitespace.", () => {
            const tokens = tokenizeAll("   ");

            expect(tokens).toEqual([new EndOfFilePrimitiveToken("", [
                new WhitespaceTrivia("   ")
            ])]);
        });

        describe("token assigment", () => {
            it("tokenize - Trivia between two tokens on the same line is assigned to the trailing trivia of the first token.", () => {
                const tokens = tokenizeAllWithoutEnd("step  ?!!put");
    
                expect(tokens).toEqual([
                    new IdentifierPrimitiveToken("step", [], [new WhitespaceTrivia("  "), new InvalidCharactersTrivia("?!!")]),
                    new IdentifierPrimitiveToken("put")
                ]);
            });

            it("tokenize - At end of line, trivia between the last token on the line and end of line (including end of line trivia) is assigned to the trailing trivia of the last token on the line.", () => {
                const tokens = tokenizeAllWithoutEnd("step  \r\n put");
    
                expect(tokens).toEqual([
                    new IdentifierPrimitiveToken("step", [], [new WhitespaceTrivia("  "), new EndOfLineTrivia("\r\n")]),
                    new IdentifierPrimitiveToken("put", [new WhitespaceTrivia(" ")])
                ]);
            });

            it("tokenize - At end of line, trivia between the end of line (excluding) and next token is assigned to the leading trivia of the next token.", () => {
                const tokens = tokenizeAllWithoutEnd("step\r\n// comment\r\nput");
    
                expect(tokens).toEqual([
                    new IdentifierPrimitiveToken("step", [], [new EndOfLineTrivia("\r\n")]),
                    new IdentifierPrimitiveToken("put", [new SinglelineCommentTrivia("// comment"), new EndOfLineTrivia("\r\n")])
                ]);
            });

            it("tokenize - Before the first token, trivia is assigned to the leading trivia of the first token", () => {
                const tokens = tokenizeAllWithoutEnd("!!!\n step");
    
                expect(tokens).toEqual([
                    new IdentifierPrimitiveToken("step", [new InvalidCharactersTrivia("!!!"), new EndOfLineTrivia("\n"), new WhitespaceTrivia(" ")])
                ]);
            });
        })
    });

    describe("complex cases", () => {
        it("tokenize - Tokenizes a small program.", () => {
            const tokens = tokenizeAll("if not wall step end");

            expect(tokens).toEqual([
                new IfPrimitiveToken("if", [], [new WhitespaceTrivia(" ")]),
                new NotPrimitiveToken("not", [], [new WhitespaceTrivia(" ")]),
                new IdentifierPrimitiveToken("wall", [], [new WhitespaceTrivia(" ")]),
                new IdentifierPrimitiveToken("step", [], [new WhitespaceTrivia(" ")]),
                new EndPrimitiveToken("end"),
                new EndOfFilePrimitiveToken("")
            ]);
        });

        it("tokenize - Tokenizes a big program.", () => {
            const tokens = tokenizeAll(`/**
 * Turns karel right.
 */
program turnRight
    repeat 3 times // 3 times left is same as once right.
        turnLeft
    end
end`
);

            expect(tokens).toEqual([
                new ProgramPrimitiveToken("program", [new MultilineCommentTrivia("/**\n * Turns karel right.\n */"), new EndOfLineTrivia("\n")], [new WhitespaceTrivia(" ")]),
                new IdentifierPrimitiveToken("turnRight", [], [new EndOfLineTrivia("\n")]),
                new RepeatPrimitiveToken("repeat", [new WhitespaceTrivia("    ")], [new WhitespaceTrivia(" ")]),
                new NumberPrimitiveToken("3", [], [new WhitespaceTrivia(" ")]),
                new TimesPrimitiveToken("times", [], [new WhitespaceTrivia(" "), new SinglelineCommentTrivia("// 3 times left is same as once right."), new EndOfLineTrivia("\n")]),
                new IdentifierPrimitiveToken("turnLeft", [new WhitespaceTrivia("        ")], [new EndOfLineTrivia("\n")]),
                new EndPrimitiveToken("end", [new WhitespaceTrivia("    ")], [new EndOfLineTrivia("\n")]),
                new EndPrimitiveToken("end"),
                new EndOfFilePrimitiveToken("")
            ]);
        });
    })
});

/**
 * Tokenizes the whole text with {@link Lexer} and returns the resulting tokens.
 * @param text Text to be tokenized.
 */
function tokenizeAll(text: string): PrimitiveToken[] {
    const lexerContext = new FullLexerContext(text);
    const tokens = [];
    while (true) {
        const token = Lexer.tokenize(lexerContext);
        tokens.push(token);

        if (token instanceof EndOfFilePrimitiveToken)
            break;
    }
    return tokens;
}

/**
 * Tokenizes the whole text with {@link Lexer} and returns the resulting tokens, but without the last {@link EndOfFilePrimitiveToken}.
 * @param text Text to be tokenized.
 */
function tokenizeAllWithoutEnd(text: string) {
    const tokens = tokenizeAll(text);
    tokens.pop();
    return tokens;
}
