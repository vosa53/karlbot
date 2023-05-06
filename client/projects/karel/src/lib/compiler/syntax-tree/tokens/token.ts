import { LineTextRange } from "../../../text/line-text-range";
import { Node } from "../nodes/node";
import { SyntaxElement } from "../syntax-element";
import { TextRange } from "../../../text/text-range";
import { Trivia } from "../trivia/trivia";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { SkippedTokenTrivia } from "../trivia/skipped-token-trivia";
import { InvalidCharactersTrivia } from "../trivia/invalid-characters-trivia";
import { SyntaxError } from "../../errors/syntax-error";
import { ArrayUtils } from "../../../utils/array-utils";

/**
 * Represents terminal symbol of Karel grammar in a syntax tree.
 * 
 * Lazy-created wrapper for {@link PrimitiveToken}.
 */
export abstract class Token extends SyntaxElement {
    /**
     * Text of the token itself (without trivia).
     */
    get text(): string {
        return (<PrimitiveToken>this.primitive).text;
    }

    /**
     * Trivia before the token.
     */
    get leadingTrivia(): readonly Trivia[] {
        return (<PrimitiveToken>this.primitive).leadingTrivia;
    }

    /**
     * Trivia after the token.
     */
    get trailingTrivia(): readonly Trivia[] {
        return (<PrimitiveToken>this.primitive).trailingTrivia;
    }

    /**
     * @param primitiveToken Wrapped primitive token.
     * @param parent Parent node.
     * @param position Position in the text. First is 0.
     * @param startLine Line in the text where it starts. First is 1.
     * @param startColumn Column in the text where it starts. First is 1.
     */
    constructor(primitiveToken: PrimitiveToken, parent: Node, position: number, startLine: number, startColumn: number) {
        super(primitiveToken, parent, position, startLine, startColumn)
    }

    override getTextRangeWithoutTrivia(): TextRange {
        const primitiveToken = (<PrimitiveToken>this.primitive);

        return new TextRange(
            this.position + primitiveToken.textPosition,
            primitiveToken.text.length
        );
    }

    override getLineTextRangeWithoutTrivia(): LineTextRange {
        const primitiveToken = (<PrimitiveToken>this.primitive);

        return new LineTextRange(
            this.startLine + primitiveToken.textStartLine - 1,
            primitiveToken.textStartLine > 1 ? primitiveToken.textStartColumn : this.startColumn + primitiveToken.textStartColumn - 1,
            this.startLine + primitiveToken.textEndLine - 1,
            primitiveToken.textEndLine > 1 ? primitiveToken.textEndColumn : this.startColumn + primitiveToken.textEndColumn - 1
        );
    }
}

/**
 * Represents terminal symbol of Karel grammar in a syntax tree.
 */
export abstract class PrimitiveToken extends PrimitiveSyntaxElement {
    /**
     * Text of the token itself (without trivia).
     */
    readonly text: string;

    /**
     * Trivia before the token.
     */
    readonly leadingTrivia: readonly Trivia[];

    /**
     * Trivia after the token.
     */
    readonly trailingTrivia: readonly Trivia[];

    /**
     * Character position where the token itself starts. In other words it is total character length of the leading trivia.
     */
    readonly textPosition: number;

    /**
     * Line where the token itself starts. In other words it is total line count of the leading trivia.
     */
    readonly textStartLine: number;

    /**
     * Column where the token itself starts.
     */
    readonly textStartColumn: number;

    /**
     * Line where the token itself ends.
     */
    readonly textEndLine: number;

    /**
     * Column where the token itself ends.
     */
    readonly textEndColumn: number;

    /**
     * @param text Text of the token itself (without trivia).
     * @param leadingTrivia Trivia before the token.
     * @param trailingTrivia Trivia after the token.
     */
    constructor(text: string, leadingTrivia: readonly Trivia[] = [], trailingTrivia: readonly Trivia[] = []) {
        const syntaxErrors: SyntaxError[] = [];
        const cursor = {
            position: 0,
            line: 1,
            column: 1
        };

        PrimitiveToken.processTrivia(leadingTrivia, cursor, syntaxErrors);
        const textStartCursor = { ...cursor };
        PrimitiveToken.processText(text, cursor);
        const textEndCursor = { ...cursor };
        PrimitiveToken.processTrivia(trailingTrivia, cursor, syntaxErrors);

        super(cursor.position, cursor.line, cursor.column - 1, syntaxErrors);
        this.text = text;
        this.leadingTrivia = leadingTrivia;
        this.trailingTrivia = trailingTrivia;
        
        this.textPosition = textStartCursor.position;
        this.textStartLine = textStartCursor.line;
        this.textStartColumn = textStartCursor.column;

        this.textEndLine = textEndCursor.line;
        this.textEndColumn = textEndCursor.column;
    }

    /**
     * Copies the primitive token with the specified changed properties.
     * @param newProperties New property values. Omitted will be copied from this primitive token.
     */
    abstract with(newProperties: { text?: string; leadingTrivia?: Trivia[]; trailingTrivia?: Trivia[]; }): PrimitiveToken;

    override equals(other: PrimitiveSyntaxElement): boolean {
        return other instanceof PrimitiveToken && this.text === other.text &&
            ArrayUtils.equals(this.leadingTrivia, other.leadingTrivia, (t, o) => t.equals(o)) && 
            ArrayUtils.equals(this.trailingTrivia, other.trailingTrivia, (t, o) => t.equals(o));
    }

    abstract override createWrapper(parent: Node, position: number, startLine: number, startColumn: number): Token;

    override pushText(texts: string[]) {
        for (const trivia of this.leadingTrivia)
            texts.push(trivia.text);

        texts.push(this.text);

        for (const trivia of this.trailingTrivia)
            texts.push(trivia.text);
    }

    private static processTrivia(trivias: readonly Trivia[], cursor: { line: number, column: number, position: number }, syntaxErrors: SyntaxError[]) {
        for (const trivia of trivias) {
            const startLine = cursor.line;
            const startColumn = cursor.column; 

            for (let i = 0; i < trivia.text.length; i++) {
                if (trivia.text[i] === "\r" && !(i + 1 < trivia.text.length && trivia.text[i + 1] === "\n") || trivia.text[i] === "\n") {
                    cursor.line++;
                    cursor.column = 1;
                }
                else
                    cursor.column++;
            }
            cursor.position += trivia.text.length;

            if (trivia instanceof SkippedTokenTrivia)
                syntaxErrors.push(new SyntaxError("Skipped token", new LineTextRange(startLine, startColumn, cursor.line, cursor.column)));
            if (trivia instanceof InvalidCharactersTrivia)
                syntaxErrors.push(new SyntaxError("Invalid characters", new LineTextRange(startLine, startColumn, cursor.line, cursor.column)));
        }
    }

    private static processText(text: string, cursor: { line: number, column: number, position: number }) {
        for (let i = 0; i < text.length; i++) {
            if (text[i] === "\r" && !(i + 1 < text.length && text[i + 1] === "\n") || text[i] === "\n") {
                cursor.line++;
                cursor.column = 1;
            }
            else
            cursor.column++;
        }
        cursor.position += text.length;
    }
}