import { ArrayUtils } from "../../../utils/array-utils";
import { PrimitiveSyntaxElementUtils } from "../../../utils/primitive-syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { SyntaxError } from "../../errors/syntax-error";
import { LineTextRange } from "../../line-text-range";
import { BlockNode } from "../nodes/block-node";
import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { EndPrimitiveToken } from "../primitive-tokens/end-primitive-token";
import { PrimitiveNode } from "./primitive-node";

export class BlockPrimitiveNode extends PrimitiveNode {
    readonly statements: readonly PrimitiveNode[];
    readonly endToken: EndPrimitiveToken | null;

    constructor(statements: readonly PrimitiveNode[], endToken: EndPrimitiveToken | null) {
        super(BlockPrimitiveNode.createChildren(statements, endToken));
        this.statements = statements;
        this.endToken = endToken;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof BlockPrimitiveNode && 
            ArrayUtils.equals(this.statements, other.statements, (t, o) => t.equals(o)) && 
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.endToken, other.endToken);
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): BlockNode {
        return new BlockNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(statements: readonly PrimitiveNode[], endToken: EndPrimitiveToken | null): ChildrenBuilder {
        const children = new ChildrenBuilder();
    
        for (const statement of statements)
            children.addChild(statement);

        children.addChildOrError(endToken, "Missing end token");
    
        return children;
    }
}