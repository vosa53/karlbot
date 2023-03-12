import { CompilationUnitNode } from "../syntax-tree/nodes/compilation-unit-node";
import { BlockPrimitiveNode } from "../syntax-tree/nodes/block-node";
import { CallPrimitiveNode } from "../syntax-tree/nodes/call-node";
import { CompilationUnitPrimitiveNode } from "../syntax-tree/nodes/compilation-unit-node";
import { IfPrimitiveNode } from "../syntax-tree/nodes/if-node";
import { PrimitiveNode } from "../syntax-tree/nodes/node";
import { ProgramPrimitiveNode } from "../syntax-tree/nodes/program-node";
import { RepeatPrimitiveNode } from "../syntax-tree/nodes/repeat-node";
import { WhilePrimitiveNode } from "../syntax-tree/nodes/while-node";
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
import { Trivia } from "../syntax-tree/trivia/trivia";
import { WhitespaceTrivia } from "../syntax-tree/trivia/whitespace-trivia";
import { FullLexerContext } from "./full-lexer-context";
import { FullParserContext } from "./full-parser-context";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

describe("Parser", () => {
    describe("program", () => {
        it("parseCompilationUnit - Parses a valid program.", () => {
            const tokens = parseWithEndOfFile([
                new ProgramPrimitiveToken("program"),
                new IdentifierPrimitiveToken("main"),
                new EndPrimitiveToken("end")
            ]);
    
            const expected = 
                new CompilationUnitPrimitiveNode([
                    new ProgramPrimitiveNode(
                        new ProgramPrimitiveToken("program"),
                        new IdentifierPrimitiveToken("main"),
                        new BlockPrimitiveNode(
                            [], 
                            new EndPrimitiveToken("end")
                        )
                    )
                ], 
                    new EndOfFilePrimitiveToken(""),
                    ""
                );
            expect(tokens).toEqual(expected);
        });

        it("parseCompilationUnit - Parses a program without name.", () => {
            const tokens = parseWithEndOfFile([
                new ProgramPrimitiveToken("program"),
                new EndPrimitiveToken("end")
            ]);
    
            const expected = 
                new CompilationUnitPrimitiveNode([
                    new ProgramPrimitiveNode(
                        new ProgramPrimitiveToken("program"),
                        null,
                        new BlockPrimitiveNode(
                            [], 
                            new EndPrimitiveToken("end")
                        )
                    )
                ], 
                    new EndOfFilePrimitiveToken(""),
                    ""
                );
            expect(tokens).toEqual(expected);
        });
    });

    describe("call", () => {
        it("parseCompilationUnit - Parses a call.", () => {
            const tokens = parseInProgramContext([
                new IdentifierPrimitiveToken("step")
            ]);
    
            const expected = [
                new CallPrimitiveNode(
                    new IdentifierPrimitiveToken("step")
                )
            ];
            expect(tokens).toEqual(expected);
        });
    });

    describe("if", () => {
        it("parseCompilationUnit - Parses an if.", () => {
            const tokens = parseInProgramContext([
                new IfPrimitiveToken("if"),
                new IsPrimitiveToken("is"),
                new IdentifierPrimitiveToken("wall"),
                new EndPrimitiveToken("end")
            ]);
    
            const expected = [
                new IfPrimitiveNode(
                    new IfPrimitiveToken("if"),
                    new IsPrimitiveToken("is"),
                    new CallPrimitiveNode(
                        new IdentifierPrimitiveToken("wall")
                    ),
                    new BlockPrimitiveNode(
                        [],
                        new EndPrimitiveToken("end")
                    ),
                    null,
                    null
                )
            ];
            expect(tokens).toEqual(expected);
        });
    });

    describe("while", () => {
        it("parseCompilationUnit - Parses a while.", () => {
            const tokens = parseInProgramContext([
                new WhilePrimitiveToken("while"),
                new IsPrimitiveToken("is"),
                new IdentifierPrimitiveToken("wall"),
                new EndPrimitiveToken("end")
            ]);
    
            const expected = [
                new WhilePrimitiveNode(
                    new WhilePrimitiveToken("while"),
                    new IsPrimitiveToken("is"),
                    new CallPrimitiveNode(
                        new IdentifierPrimitiveToken("wall")
                    ),
                    new BlockPrimitiveNode(
                        [],
                        new EndPrimitiveToken("end")
                    )
                )
            ];
            expect(tokens).toEqual(expected);
        });
    });

    describe("repeat", () => {
        it("parseCompilationUnit - Parses a repeat.", () => {
            const tokens = parseInProgramContext([
                new RepeatPrimitiveToken("repeat"),
                new NumberPrimitiveToken("4"),
                new TimesPrimitiveToken("times"),
                new EndPrimitiveToken("end")
            ]);
    
            const expected = [
                new RepeatPrimitiveNode(
                    new RepeatPrimitiveToken("repeat"),
                    new NumberPrimitiveToken("4"),
                    new TimesPrimitiveToken("times"),
                    new BlockPrimitiveNode(
                        [],
                        new EndPrimitiveToken("end")
                    )
                )
            ];
            expect(tokens).toEqual(expected);
        });
    });
});

function parseInProgramContext(tokens: PrimitiveToken[]): readonly PrimitiveNode[] {
    const tokensWithProgram = [
        new ProgramPrimitiveToken("program"),
        new IdentifierPrimitiveToken("test"),
        ...tokens,
        new EndPrimitiveToken("end"),
    ];
    const compilationUnit = parseWithEndOfFile(tokensWithProgram);
    return compilationUnit.programs[0].body!.statements;
}

function parseWithEndOfFile(tokens: PrimitiveToken[]): CompilationUnitPrimitiveNode {
    const endOfFileToken = new EndOfFilePrimitiveToken("", [], []);
    const tokensWithEndOfFile = [...tokens, endOfFileToken];
    const parserContext = new FullParserContext(tokensWithEndOfFile);
    return Parser.parseCompilationUnit(parserContext, "");
}
