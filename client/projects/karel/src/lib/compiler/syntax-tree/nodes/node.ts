import { ArrayUtils } from "../../../utils/array-utils";
import { ChildrenBuilder } from "../../children-builder";
import { LineTextRange } from "../../../text/line-text-range";
import { TextRange } from "../../../text/text-range";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { SyntaxElement } from "../syntax-element";

export abstract class Node extends SyntaxElement {
    get children(): SyntaxElement[] {
        if (this._children === undefined)
            this.initializeChildren();
        return this._children!;
    }

    private _children?: SyntaxElement[] = undefined;

    constructor(primitiveNode: PrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    getTextRangeWithoutTrivia(): TextRange {
        // TODO: bug
        return this.getTextRange();
    }

    getLineTextRangeWithoutTrivia(): LineTextRange {
        // TODO: bug
        return this.getLineTextRange();
    }

    private initializeChildren() {
        this._children = [];

        let currentPosition = this.position;
        let currentLine = this.startLine;
        let currentColumn = this.startColumn;

        const primitiveNode = <PrimitiveNode>this.primitive;
        for (const primitiveChild of primitiveNode.children) {
            const child = primitiveChild.createWrapper(this, currentPosition, currentLine, currentColumn);

            this._children.push(child);

            currentPosition += primitiveChild.length;
            currentLine += primitiveChild.lineCount - 1;
            currentColumn = primitiveChild.lineCount > 1 ? primitiveChild.lastLineLength + 1 : currentColumn + primitiveChild.length;
        }
    }
}


export abstract class PrimitiveNode extends PrimitiveSyntaxElement {
    readonly children: readonly PrimitiveSyntaxElement[];
    
    constructor(childrenBuilder: ChildrenBuilder) {
        super(childrenBuilder.length, childrenBuilder.lineCount, childrenBuilder.lastLineLength, childrenBuilder.syntaxErrors);
        this.children = childrenBuilder.children;
    }

    equals(other: PrimitiveSyntaxElement): boolean {
        return other instanceof PrimitiveNode &&
            ArrayUtils.equals(this.children, other.children, (t, o) => t.equals(o));
    }

    abstract override createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): Node;

    override pushText(texts: string[]) {
        for (const child of this.children)
            child.pushText(texts);
    }
}