import { Node } from "../nodes/node";
import { ProgramNode } from "../nodes/program-node";
import { IdentifierPrimitiveToken } from "../primitive-tokens/identifier-primitive-token";
import { ProgramPrimitiveToken } from "../primitive-tokens/program-primitive-token";
import { PrimitiveToken } from "../primitive-tokens/primitive-token";
import { BlockPrimitiveNode } from "./block-primitive-node";
import { PrimitiveNode } from "./primitive-node";
import { SyntaxError } from "../../errors/syntax-error";
import { LineTextRange } from "../../line-text-range";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { ChildrenBuilder } from "../../children-builder";
import { PrimitiveSyntaxElementUtils } from "../../../utils/primitive-syntax-element-utils";

export class ProgramPrimitiveNode extends PrimitiveNode {
    readonly programToken: ProgramPrimitiveToken | null;
    readonly nameToken: IdentifierPrimitiveToken | null;
    readonly body: BlockPrimitiveNode | null;

    constructor(programToken: ProgramPrimitiveToken | null, nameToken: IdentifierPrimitiveToken | null, body: BlockPrimitiveNode | null) {
        super(ProgramPrimitiveNode.createChildren(programToken, nameToken, body));
        this.programToken = programToken;
        this.nameToken = nameToken;
        this.body = body;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof ProgramPrimitiveNode &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.programToken, other.programToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.nameToken, other.nameToken) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.body, other.body);
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): ProgramNode {
        return new ProgramNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(programToken: ProgramPrimitiveToken | null, nameToken: IdentifierPrimitiveToken | null, body: BlockPrimitiveNode | null): ChildrenBuilder {
        const children = new ChildrenBuilder();
    
        children.addChildOrError(programToken, "Missing program token");
        children.addChildOrError(nameToken, "Missing name token");
        children.addChildOrError(body, "Missing body");
    
        return children;
    }
}