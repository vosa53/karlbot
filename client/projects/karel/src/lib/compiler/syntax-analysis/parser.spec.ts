import { CompilationUnitNode } from "../syntax-tree/nodes/compilation-unit-node";
import { BlockPrimitiveNode } from "../syntax-tree/primitive-nodes/block-primitive-node";
import { CallPrimitiveNode } from "../syntax-tree/primitive-nodes/call-primitive-node";
import { CompilationUnitPrimitiveNode } from "../syntax-tree/primitive-nodes/compilation-unit-primitive-node";
import { IfPrimitiveNode } from "../syntax-tree/primitive-nodes/if-primitive-node";
import { PrimitiveNode } from "../syntax-tree/primitive-nodes/primitive-node";
import { ProgramPrimitiveNode } from "../syntax-tree/primitive-nodes/program-primitive-node";
import { RepeatPrimitiveNode } from "../syntax-tree/primitive-nodes/repeat-primitive-node";
import { WhilePrimitiveNode } from "../syntax-tree/primitive-nodes/while-primitive-node";
import { ElsePrimitiveToken } from "../syntax-tree/primitive-tokens/else-primitive-token";
import { EndOfFilePrimitiveToken } from "../syntax-tree/primitive-tokens/end-of-file-primitive-token";
import { EndPrimitiveToken } from "../syntax-tree/primitive-tokens/end-primitive-token";
import { IdentifierPrimitiveToken } from "../syntax-tree/primitive-tokens/identifier-primitive-token";
import { IfPrimitiveToken } from "../syntax-tree/primitive-tokens/if-primitive-token";
import { IsPrimitiveToken } from "../syntax-tree/primitive-tokens/is-primitive-token";
import { NotPrimitiveToken } from "../syntax-tree/primitive-tokens/not-primitive-token";
import { NumberPrimitiveToken } from "../syntax-tree/primitive-tokens/number-primitive-token";
import { PrimitiveToken } from "../syntax-tree/primitive-tokens/primitive-token";
import { ProgramPrimitiveToken } from "../syntax-tree/primitive-tokens/program-primitive-token";
import { RepeatPrimitiveToken } from "../syntax-tree/primitive-tokens/repeat-primitive-token";
import { TimesPrimitiveToken } from "../syntax-tree/primitive-tokens/times-primitive-token";
import { WhilePrimitiveToken } from "../syntax-tree/primitive-tokens/while-primitive-token";
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
    it("parseCompilationUnit - Parses a program.", () => {
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
