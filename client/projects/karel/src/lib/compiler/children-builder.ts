import { SyntaxError } from "./errors/syntax-error";
import { LineTextRange } from "./line-text-range";
import { PrimitiveSyntaxElement } from "./primitive-syntax-element";

export class ChildrenBuilder {
    get children(): readonly PrimitiveSyntaxElement[] {
        return this._children;
    }

    get syntaxErrors(): readonly SyntaxError[] {
        return this._syntaxErrors;
    }

    get length(): number {
        return this._length;
    }

    get lineCount(): number {
        return this._lineCount;
    }

    get lastLineLength(): number {
        return this._lastLineLength;
    }

    private readonly _children: PrimitiveSyntaxElement[] = [];
    private readonly _syntaxErrors: SyntaxError[] = [];
    private _length = 0;
    private _lineCount = 1;
    private _lastLineLength = 0;

    addChild(child: PrimitiveSyntaxElement) {
        this._children.push(child);

        this._length += child.length;
        this._lineCount += child.lineCount - 1;
        this._lastLineLength = child.lineCount > 1 ? child.lastLineLength : this._lastLineLength + child.length;
    }

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