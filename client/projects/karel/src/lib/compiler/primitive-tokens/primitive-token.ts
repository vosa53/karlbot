import { ArrayUtils } from "../../utils/array-utils";
import { SyntaxError } from "../errors/syntax-error";
import { LineTextRange } from "../line-text-range";
import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { Token } from "../tokens/token";
import { InvalidCharactersTrivia } from "../trivia/invalid-characters-trivia";
import { SkippedTokenTrivia } from "../trivia/skipped-token-trivia";
import { Trivia } from "../trivia/trivia";

export abstract class PrimitiveToken extends PrimitiveSyntaxElement {
    readonly text: string;
    readonly leadingTrivia: readonly Trivia[];
    readonly trailingTrivia: readonly Trivia[];
    readonly textPosition: number;
    readonly textStartLine: number;
    readonly textStartColumn: number;
    readonly textEndLine: number;
    readonly textEndColumn: number;

    constructor(text: string, leadingTrivia: readonly Trivia[] = [], trailingTrivia: readonly Trivia[] = []) {
        const syntaxErrors = [];
        let position = 0;
        let line = 1;
        let column = 1;

        for (const trivia of leadingTrivia) {
            const startLine = line;
            const startColumn = column; 

            for (let i = 0; i < trivia.text.length; i++) {
                if (trivia.text[i] === "\r" && !(i + 1 < trivia.text.length && trivia.text[i + 1] === "\n") || trivia.text[i] === "\n") {
                    line++;
                    column = 1;
                }
                else
                    column++;
            }
            position += trivia.text.length;

            if (trivia instanceof SkippedTokenTrivia)
                syntaxErrors.push(new SyntaxError("Skipped token", new LineTextRange(startLine, startColumn, line, column)));
            if (trivia instanceof InvalidCharactersTrivia)
                syntaxErrors.push(new SyntaxError("Invalid characters", new LineTextRange(startLine, startColumn, line, column)));
        }

        const textPosition = position;
        const textStartLine = line;
        const textStartColumn = column;

        for (let i = 0; i < text.length; i++) {
            if (text[i] === "\r" && !(i + 1 < text.length && text[i + 1] === "\n") || text[i] === "\n") {
                line++;
                column = 1;
            }
            else
                column++;
        }
        position += text.length;

        const textEndLine = line;
        const textEndColumn = column;

        for (const trivia of trailingTrivia) {
            const startLine = line;
            const startColumn = column; 

            for (let i = 0; i < trivia.text.length; i++) {
                if (trivia.text[i] === "\r" && !(i + 1 < trivia.text.length && trivia.text[i + 1] === "\n") || trivia.text[i] === "\n") {
                    line++;
                    column = 1;
                }
                else
                    column++;
            }
            position += trivia.text.length;

            if (trivia instanceof SkippedTokenTrivia)
                syntaxErrors.push(new SyntaxError("Skipped token", new LineTextRange(startLine, startColumn, line, column)));
            if (trivia instanceof InvalidCharactersTrivia)
                syntaxErrors.push(new SyntaxError("Invalid characters", new LineTextRange(startLine, startColumn, line, column)));
        }

        super(position, line, column - 1, syntaxErrors);
        this.text = text;
        this.leadingTrivia = leadingTrivia;
        this.trailingTrivia = trailingTrivia;
        
        this.textPosition = textPosition;
        this.textStartLine = textStartLine;
        this.textStartColumn = textStartColumn;

        this.textEndLine = textEndLine;
        this.textEndColumn = textEndColumn;
    }

    equals(other: PrimitiveSyntaxElement): boolean {
        return other instanceof PrimitiveToken && this.text === other.text &&
            ArrayUtils.equals(this.leadingTrivia, other.leadingTrivia, (t, o) => t.equals(o)) && 
            ArrayUtils.equals(this.trailingTrivia, other.trailingTrivia, (t, o) => t.equals(o));
    }

    abstract override createWrapper(parent: Node, position: number, startLine: number, startColumn: number): Token;

    abstract with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken;

    pushText(texts: string[]) {
        for (const trivia of this.leadingTrivia)
            texts.push(trivia.text);

        texts.push(this.text);

        for (const trivia of this.trailingTrivia)
            texts.push(trivia.text);
    }
}