import { PrimitiveSyntaxElementUtils } from "../../../utils/syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { IdentifierPrimitiveToken } from "../tokens/identifier-token";
import { IdentifierToken } from "../tokens/identifier-token";
import { Node, PrimitiveNode } from "./node";

export class CallNode extends Node {
    get nameToken(): IdentifierToken | null {
        if (this._nameToken === undefined)
            this.initialize();
        return this._nameToken!;
    }

    private _nameToken?: IdentifierToken | null = undefined;

    constructor(primitiveNode: CallPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    with(newProperties: { nameToken?: IdentifierToken | null }): CallNode {
        const callPrimitiveNode = <CallPrimitiveNode>this.primitive;

        return new CallPrimitiveNode(
            newProperties.nameToken === undefined ? callPrimitiveNode.nameToken : <IdentifierPrimitiveToken | null>(newProperties.nameToken?.primitive ?? null)
        ).createWrapper(null, 0, 1, 1);
    }

    private initialize() {
        const callPrimitiveNode = <CallPrimitiveNode>this.primitive;
        
        this._nameToken = callPrimitiveNode.nameToken !== null ? <IdentifierToken>this.children[0] : null;
    }
}


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