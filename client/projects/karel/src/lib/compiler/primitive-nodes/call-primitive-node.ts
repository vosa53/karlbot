import { PrimitiveSyntaxElementUtils } from "../../utils/primitive-syntax-element-utils";
import { ChildrenBuilder } from "../children-builder";
import { SyntaxError } from "../errors/syntax-error";
import { LineTextRange } from "../line-text-range";
import { CallNode } from "../nodes/call-node";
import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { IdentifierPrimitiveToken } from "../primitive-tokens/identifier-primitive-token";
import { PrimitiveNode } from "./primitive-node";

export class CallPrimitiveNode extends PrimitiveNode {
    readonly nameToken: IdentifierPrimitiveToken | null;

    constructor(nameToken: IdentifierPrimitiveToken | null) {
        super(CallPrimitiveNode.createChildren(nameToken));
        this.nameToken = nameToken;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof CallPrimitiveNode &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.nameToken, other.nameToken);
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): CallNode {
        return new CallNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(nameToken: IdentifierPrimitiveToken | null): ChildrenBuilder {
        const children = new ChildrenBuilder();
    
        children.addChildOrError(nameToken, "Missing name token");
    
        return children;
    }
}