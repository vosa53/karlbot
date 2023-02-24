import { LineTextRange } from "./line-text-range";
import { Node } from "./nodes/node";
import { PrimitiveSyntaxElement } from "./primitive-syntax-element";
import { TextRange } from "./text-range";

export abstract class SyntaxElement {
    readonly position: number;
    readonly startLine: number;
    readonly startColumn: number;

    readonly parent: Node | null;
    readonly primitive: PrimitiveSyntaxElement;

    get length(): number {
        return this.primitive.length;
    }

    get lineCount(): number {
        return this.primitive.lineCount;
    }

    get lastLineLength(): number {
        return this.primitive.lastLineLength;
    }

    get endLine(): number {
        return this.startLine + this.primitive.lineCount - 1;
    }

    get endColumn(): number {
        return this.primitive.lineCount > 1 ? this.primitive.lastLineLength + 1 : this.startColumn + this.primitive.length;
    }

    constructor(primitive: PrimitiveSyntaxElement, parent: Node | null, position: number, startLine: number, startColumn: number) {
        this.primitive = primitive;
        this.parent = parent;
        this.position = position;
        this.startLine = startLine;
        this.startColumn = startColumn;
    }

    abstract getTextRangeWithoutTrivia(): TextRange;
    abstract getLineTextRangeWithoutTrivia(): LineTextRange;

    getTextRange(): TextRange {
        return new TextRange(
            this.position,
            this.length
        );
    }

    getLineTextRange(): LineTextRange {
        return new LineTextRange(
            this.startLine,
            this.startColumn,
            this.endLine,
            this.endColumn
        );
    }

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