import { Node } from "../nodes/node";
import { RepeatNode } from "../nodes/repeat-node";
import { NumberPrimitiveToken } from "../primitive-tokens/number-primitive-token";
import { RepeatPrimitiveToken } from "../primitive-tokens/repeat-primitive-token";
import { TimesPrimitiveToken } from "../primitive-tokens/times-primitive-token";
import { PrimitiveToken } from "../primitive-tokens/primitive-token";
import { BlockPrimitiveNode } from "./block-primitive-node";
import { PrimitiveNode } from "./primitive-node";
import { SyntaxError } from "../errors/syntax-error";
import { LineTextRange } from "../line-text-range";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { ChildrenBuilder } from "../children-builder";
import { PrimitiveSyntaxElementUtils } from "../../utils/primitive-syntax-element-utils";

export class RepeatPrimitiveNode extends PrimitiveNode {
    readonly repeatToken: RepeatPrimitiveToken | null;
    readonly countToken: NumberPrimitiveToken | null;
    readonly timesToken: TimesPrimitiveToken | null;
    readonly body: BlockPrimitiveNode | null;

    constructor(repeatToken: RepeatPrimitiveToken | null, countToken: NumberPrimitiveToken | null, timesToken: TimesPrimitiveToken | null, body: BlockPrimitiveNode | null) {
        super(RepeatPrimitiveNode.createChildren(repeatToken, countToken, timesToken, body));
        this.repeatToken = repeatToken;
        this.countToken = countToken;
        this.timesToken = timesToken;
        this.body = body;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof RepeatPrimitiveNode &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.repeatToken, other.repeatToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.countToken, other.countToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.timesToken, other.timesToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.body, other.body);
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): RepeatNode {
        return new RepeatNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(repeatToken: RepeatPrimitiveToken | null, countToken: NumberPrimitiveToken | null, timesToken: TimesPrimitiveToken | null, body: BlockPrimitiveNode | null): ChildrenBuilder {
        const children = new ChildrenBuilder();
    
        children.addChildOrError(repeatToken, "Missing repeat token");
        children.addChildOrError(countToken, "Missing count token");
        children.addChildOrError(timesToken, "Missing times token");
        children.addChildOrError(body, "Missing body");
    
        return children;
    }
}