import { ArrayUtils } from "../../../utils/array-utils";
import { ChildrenBuilder } from "../../children-builder";
import { LineTextRange } from "../../../text/line-text-range";
import { TextRange } from "../../../text/text-range";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { SyntaxElement } from "../syntax-element";
import { PrimitiveToken } from "../tokens/token";

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
        const firstToken = this.getFirstDescendantPrimitiveToken();
        const lastToken = this.getLastDescendantPrimitiveToken();

        return new TextRange(
            this.position + firstToken.textPosition,
            this.length - firstToken.textPosition - (lastToken.length - lastToken.textPosition - lastToken.text.length)
        );
    }

    getLineTextRangeWithoutTrivia(): LineTextRange {
        const firstToken = this.getFirstDescendantPrimitiveToken();
        const lastToken = this.getLastDescendantPrimitiveToken();

        return new LineTextRange(
            this.startLine + firstToken.textStartLine - 1,
            firstToken.textStartLine > 1 ? firstToken.textStartColumn : this.startColumn + firstToken.textStartColumn - 1,
            this.endLine - (lastToken.lineCount - lastToken.textEndLine),
            lastToken.textEndLine > 1 ? lastToken.textEndColumn : this.startColumn + lastToken.textEndColumn - 1
        );
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

    private getFirstDescendantPrimitiveToken(): PrimitiveToken {
        let currentNode = this.primitive as PrimitiveNode;
        while (currentNode.children[0] instanceof PrimitiveNode) {
            currentNode = currentNode.children[0];
        }

        return currentNode.children[0] as PrimitiveToken;
    }

    private getLastDescendantPrimitiveToken(): PrimitiveToken {
        let currentNode = this.primitive as PrimitiveNode;
        while (currentNode.children[currentNode.children.length - 1] instanceof PrimitiveNode) {
            currentNode = currentNode.children[currentNode.children.length - 1] as PrimitiveNode;
        }

        return currentNode.children[currentNode.children.length - 1] as PrimitiveToken;
    }
}


export abstract class PrimitiveNode extends PrimitiveSyntaxElement {
    readonly children: readonly PrimitiveSyntaxElement[];
    
    constructor(childrenBuilder: ChildrenBuilder) {
        if (childrenBuilder.children.length === 0)
            throw new Error("Node must have at least one child.");

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