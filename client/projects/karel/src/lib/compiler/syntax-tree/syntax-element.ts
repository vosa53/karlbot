import { LineTextRange } from "../../text/line-text-range";
import { Node } from "./nodes/node";
import { TextRange } from "../../text/text-range";
import { SyntaxError } from "../errors/syntax-error";

/**
 * Base for AST nodes and tokens.
 */
export abstract class SyntaxElement {
    /**
     * Position in the text. First is 0.
     */
    readonly position: number;

    /**
     * Line in the text where it starts. First is 1.
     */
    readonly startLine: number;

    /**
     * Column in the text where it starts. First is 1.
     */
    readonly startColumn: number;

    /**
     * Parent node.
     */
    readonly parent: Node | null;

    /**
     * Wrapped primitive element.
     */
    readonly primitive: PrimitiveSyntaxElement;

    /**
     * Total character length of itself and its children.
     */
    get length(): number {
        return this.primitive.length;
    }

    /**
     * Total line count of itself and its children.
     */
    get lineCount(): number {
        return this.primitive.lineCount;
    }

    /**
     * Character length of the last line.
     */
    get lastLineLength(): number {
        return this.primitive.lastLineLength;
    }

    /**
     * Line in the text where it ends. First is 1.
     */
    get endLine(): number {
        return this.startLine + this.primitive.lineCount - 1;
    }

    /**
     * Column in the text where it ends. First is 1.
     */
    get endColumn(): number {
        return this.primitive.lineCount > 1 ? this.primitive.lastLineLength + 1 : this.startColumn + this.primitive.length;
    }

    /**
     * 
     * @param primitive Wrapped primitive element.
     * @param parent Parent node.
     * @param position Position in the text. First is 0.
     * @param startLine Line in the text where it starts. First is 1.
     * @param startColumn Column in the text where it starts. First is 1.
     */
    constructor(primitive: PrimitiveSyntaxElement, parent: Node | null, position: number, startLine: number, startColumn: number) {
        this.primitive = primitive;
        this.parent = parent;
        this.position = position;
        this.startLine = startLine;
        this.startColumn = startColumn;
    }

    /**
     * Returns the text range that it spans without leading and trailing trivia.
     */
    abstract getTextRangeWithoutTrivia(): TextRange;

    /**
     * Returns the line text range that it spans without leading and trailing trivia.
     */
    abstract getLineTextRangeWithoutTrivia(): LineTextRange;

    /**
     * Returns the text range that it spans.
     */
    getTextRange(): TextRange {
        return new TextRange(
            this.position,
            this.length
        );
    }

    /**
     * Returns the line text range that it spans.
     */
    getLineTextRange(): LineTextRange {
        return new LineTextRange(
            this.startLine,
            this.startColumn,
            this.endLine,
            this.endColumn
        );
    }

    /**
     * Builds and returns the whole text.
     */
    buildText(): string {
        return this.primitive.buildText();
    }

    /*findElementAtPosition(position: number): SyntaxElement | null {
        if (position < this.position)
            return null;
        if (position >= this.position + this.length)
            return null;

        let current: SyntaxElement = this;
        while (current instanceof Node && current.children.length > 0) {
            let index = 0;
            while (index + 1 < current.children.length && current.children[index + 1].position <= position)
                index++;
            current = current.children[index];
        }

        return current;
    }

    findElementAtLinePosition(line: number, column: number): SyntaxElement | null {
        if (line < this.startLine || line === this.startLine && column < this.startColumn)
            return null;
        if (line > this.endLine || line === this.endLine && column >= this.endColumn)
            return null;

        let current: SyntaxElement = this;
        while (current instanceof Node && current.children.length > 0) {
            let index = 0;
            while (index + 1 < current.children.length && (current.children[index + 1].startLine <= line || current.children[index + 1].startLine === line && current.children[index + 1].startColumn <= column))
                index++;
            current = current.children[index];
        }

        return current;
    }*/
}


/**
 * Base for primitive AST nodes and tokens.
 */
export abstract class PrimitiveSyntaxElement {
    /**
     * Total character length of itself and its children.
     */
    readonly length: number;

    /**
     * Total line count of itself and its children.
     */
    readonly lineCount: number;

    /**
     * Character length of the last line.
     */
    readonly lastLineLength: number;

    /**
     * Syntax errors.
     */
    readonly syntaxErrors: readonly SyntaxError[];

    /**
     * @param length Total character length of itself and its children.
     * @param lineCount Total line count of itself and its children.
     * @param lastLineLength Character length of the last line.
     * @param syntaxErrors Syntax errors.
     */
    constructor(length: number, lineCount: number, lastLineLength: number, syntaxErrors: readonly SyntaxError[]) {
        this.length = length;
        this.lineCount = lineCount;
        this.lastLineLength = lastLineLength;
        this.syntaxErrors = syntaxErrors;
    }

    /**
     * Returns `true` when this and other are equal. `false` otherwise.
     * @param other Other.
     */
    abstract equals(other: PrimitiveSyntaxElement): boolean;

    /**
     * Creates a wrapper.
     * @param parent Parent node of the wrapper.
     * @param position Position in the text of the created wrapper. First is 0.
     * @param startLine Line in the text where the wrapper should start.
     * @param startColumn Column in the text where the wrapper should start.
     */
    abstract createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): SyntaxElement;
    abstract pushText(texts: string[]): void;

    /**
     * Builds and returns the whole text.
     */
    buildText(): string {
        const texts: string[] = [];

        this.pushText(texts);

        return texts.join("");
    }
}