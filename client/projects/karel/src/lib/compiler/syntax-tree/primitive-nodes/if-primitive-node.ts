import { PrimitiveSyntaxElementUtils } from "../../../utils/primitive-syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { SyntaxError } from "../../errors/syntax-error";
import { LineTextRange } from "../../line-text-range";
import { IfNode } from "../nodes/if-node";
import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { ElsePrimitiveToken } from "../primitive-tokens/else-primitive-token";
import { IfPrimitiveToken } from "../primitive-tokens/if-primitive-token";
import { IsPrimitiveToken } from "../primitive-tokens/is-primitive-token";
import { NotPrimitiveToken } from "../primitive-tokens/not-primitive-token";
import { BlockPrimitiveNode } from "./block-primitive-node";
import { CallPrimitiveNode } from "./call-primitive-node";
import { PrimitiveNode } from "./primitive-node";

export class IfPrimitiveNode extends PrimitiveNode {
    readonly ifToken: IfPrimitiveToken | null;
    readonly operationToken: IsPrimitiveToken | NotPrimitiveToken | null;
    readonly condition: CallPrimitiveNode | null;
    readonly body: BlockPrimitiveNode | null;
    readonly elseToken: ElsePrimitiveToken | null;
    readonly elseBody: BlockPrimitiveNode | null;

    constructor(ifToken: IfPrimitiveToken | null, operationToken: IsPrimitiveToken | NotPrimitiveToken | null, condition: CallPrimitiveNode | null, body: BlockPrimitiveNode | null, 
        elseToken: ElsePrimitiveToken | null, elseBody: BlockPrimitiveNode | null) {
        super(IfPrimitiveNode.createChildren(ifToken, operationToken, condition, body, elseToken, elseBody));
        this.ifToken = ifToken;
        this.operationToken = operationToken;
        this.condition = condition;
        this.body = body;
        this.elseToken = elseToken;
        this.elseBody = elseBody;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof IfPrimitiveNode &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.ifToken, other.ifToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.operationToken, other.operationToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.condition, other.condition) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.body, other.body) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.elseToken, other.elseToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.elseBody, other.elseBody);
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): IfNode {
        return new IfNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(ifToken: IfPrimitiveToken | null, operationToken: IsPrimitiveToken | NotPrimitiveToken | null, condition: CallPrimitiveNode | null, body: BlockPrimitiveNode | null, 
        elseToken: ElsePrimitiveToken | null, elseBody: BlockPrimitiveNode | null): ChildrenBuilder {
        const children = new ChildrenBuilder();
    
        children.addChildOrError(ifToken, "Missing if token");
        children.addChildOrError(operationToken, "Missing operation token");
        children.addChildOrError(condition, "Missing condition");
        children.addChildOrError(body, "Missing body");

        if (elseToken != null) {
            children.addChild(elseToken);
            children.addChildOrError(elseBody, "Missing else body");
        }
        else if (elseBody != null)
            children.addChild(elseBody);
    
        return children;
    }
}