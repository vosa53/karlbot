import { SyntaxError } from "./errors/syntax-error";
import { LineTextRange } from "./line-text-range";
import { PrimitiveSyntaxElement } from "./syntax-tree/syntax-element";

/**
 * Utility class for creating primitive node children.
 */
export class ChildrenBuilder {
    /**
     * Created children.
     */
    get children(): readonly PrimitiveSyntaxElement[] {
        return this._children;
    }

    /**
     * Syntax errors.
     */
    get syntaxErrors(): readonly SyntaxError[] {
        return this._syntaxErrors;
    }

    /**
     * Total children character length.
     */
    get length(): number {
        return this._length;
    }

    /**
     * Total children line count.
     */
    get lineCount(): number {
        return this._lineCount;
    }

    /**
     * Character length of the last line of children.
     */
    get lastLineLength(): number {
        return this._lastLineLength;
    }

    private readonly _children: PrimitiveSyntaxElement[] = [];
    private readonly _syntaxErrors: SyntaxError[] = [];
    private _length = 0;
    private _lineCount = 1;
    private _lastLineLength = 0;

    /**
     * Adds a child.
     * @param child Child to be added.
     */
    addChild(child: PrimitiveSyntaxElement) {
        this._children.push(child);

        this._length += child.length;
        this._lineCount += child.lineCount - 1;
        this._lastLineLength = child.lineCount > 1 ? child.lastLineLength : this._lastLineLength + child.length;
    }

    /**
     * Adds a child or syntax error in case {@link child} is `null`.
     * @param child Child to be added.
     * @param errorMessage Syntax error message in case {@link child} is `null`.
     */
    addChildOrError(child: PrimitiveSyntaxElement | null, errorMessage: string) {
        if (child !== null)
            this.addChild(child);
        else {
            const textRange = new LineTextRange(this._lineCount, this._lastLineLength + 1, this._lineCount, this._lastLineLength + 2);
            const syntaxError = new SyntaxError(errorMessage, textRange);
            this._syntaxErrors.push(syntaxError);
        }
    }
}