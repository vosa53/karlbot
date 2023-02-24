import { SyntaxError } from "./errors/syntax-error";
import { Node } from "./nodes/node";
import { SyntaxElement } from "./syntax-element";

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