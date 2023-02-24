import { SyntaxError } from "./errors/syntax-error";
import { Node } from "./nodes/node";
import { SyntaxElement } from "./syntax-element";

export abstract class PrimitiveSyntaxElement {
    readonly length: number;
    readonly lineCount: number;
    readonly lastLineLength: number;

    readonly syntaxErrors: readonly SyntaxError[];

    constructor(length: number, lineCount: number, lastLineLength: number, syntaxErrors: readonly SyntaxError[]) {
        this.length = length;
        this.lineCount = lineCount;
        this.lastLineLength = lastLineLength;
        this.syntaxErrors = syntaxErrors;
    }

    abstract equals(other: PrimitiveSyntaxElement): boolean;
    abstract createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): SyntaxElement;
    abstract pushText(texts: string[]): void;

    buildText(): string {
        const texts: string[] = [];

        this.pushText(texts);

        return texts.join("");
    }
}