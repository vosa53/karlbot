import { ArrayUtils } from "../../../utils/array-utils";
import { ChildrenBuilder } from "../../children-builder";
import { SyntaxError } from "../../errors/syntax-error";
import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";

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