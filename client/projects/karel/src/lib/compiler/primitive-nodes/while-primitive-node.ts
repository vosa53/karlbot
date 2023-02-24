import { PrimitiveSyntaxElementUtils } from "../../utils/primitive-syntax-element-utils";
import { ChildrenBuilder } from "../children-builder";
import { SyntaxError } from "../errors/syntax-error";
import { LineTextRange } from "../line-text-range";
import { Node } from "../nodes/node";
import { WhileNode } from "../nodes/while-node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { IsPrimitiveToken } from "../primitive-tokens/is-primitive-token";
import { NotPrimitiveToken } from "../primitive-tokens/not-primitive-token";
import { PrimitiveToken } from "../primitive-tokens/primitive-token";
import { WhilePrimitiveToken } from "../primitive-tokens/while-primitive-token";
import { BlockPrimitiveNode } from "./block-primitive-node";
import { CallPrimitiveNode } from "./call-primitive-node";
import { PrimitiveNode } from "./primitive-node";

export class WhilePrimitiveNode extends PrimitiveNode {
    readonly whileToken: WhilePrimitiveToken | null;
    readonly operationToken: IsPrimitiveToken | NotPrimitiveToken | null;
    readonly condition: CallPrimitiveNode | null;
    readonly body: BlockPrimitiveNode | null;

    constructor(whileToken: WhilePrimitiveToken | null, operationToken: IsPrimitiveToken | NotPrimitiveToken | null, condition: CallPrimitiveNode | null, body: BlockPrimitiveNode | null) {
        super(WhilePrimitiveNode.createChildren(whileToken, operationToken, condition, body));
        this.whileToken = whileToken;
        this.operationToken = operationToken;
        this.condition = condition;
        this.body = body;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof WhilePrimitiveNode && 
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.whileToken, other.whileToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.operationToken, other.operationToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.condition, other.condition) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.body, other.body);
    }

    override createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): WhileNode {
        return new WhileNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(whileToken: WhilePrimitiveToken | null, operationToken: IsPrimitiveToken | NotPrimitiveToken | null, condition: CallPrimitiveNode | null, body: BlockPrimitiveNode | null): ChildrenBuilder {
        const children = new ChildrenBuilder();
    
        children.addChildOrError(whileToken, "Missing repeat token");
        children.addChildOrError(operationToken, "Missing operation token");
        children.addChildOrError(condition, "Missing condition");
        children.addChildOrError(body, "Missing body");
    
        return children;
    }
}