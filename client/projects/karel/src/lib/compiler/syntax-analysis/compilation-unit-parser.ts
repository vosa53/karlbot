import { CompilationUnitNode } from "../syntax-tree/nodes/compilation-unit-node";
import { EndOfFilePrimitiveToken } from "../syntax-tree/primitive-tokens/end-of-file-primitive-token";
import { FullLexerContext } from "./full-lexer-context";
import { FullParserContext } from "./full-parser-context";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

/**
 * Parses a compilation unit.
 */
export class CompilationUnitParser {
    /**
     * Parses the given text into a new compilation unit.
     * @param text Text to parse.
     * @param filePath Compilation unit file path.
     */
    static parse(text: string, filePath: string): CompilationUnitNode {
        const lexerContext = new FullLexerContext(text);
        const tokens = [];
        while (true) {
            const token = Lexer.tokenize(lexerContext);
            tokens.push(token);

            if (token instanceof EndOfFilePrimitiveToken)
                break;
        }
        const parserContext = new FullParserContext(tokens);
        const primitiveCompilationUnit = Parser.parseCompilationUnit(parserContext, filePath);

        return primitiveCompilationUnit.createWrapper(null, 0, 1, 1);
    }
}