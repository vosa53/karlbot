import { PrimitiveSyntaxElementUtils } from "../../../utils/syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { IdentifierPrimitiveToken } from "../tokens/identifier-token";
import { IdentifierToken } from "../tokens/identifier-token";
import { Node, PrimitiveNode } from "./node";

/**
 * Program call.
 */
export class CallNode extends Node {
    /**
     * Name of the called program.
     */
    get nameToken(): IdentifierToken | null {
        if (this._nameToken === undefined)
            this.initialize();
        return this._nameToken!;
    }

    private _nameToken?: IdentifierToken | null = undefined;

    /**
     * @param primitiveNode Wrapped primitive node.
     * @param parent Parent node.
     * @param position Position in the text. First is 0.
     * @param startLine Line in the text where it starts. First is 1.
     * @param startColumn Column in the text where it starts. First is 1.
     */
    constructor(primitiveNode: CallPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    override with(newProperties: { nameToken?: IdentifierToken | null }): CallNode {
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

/**
 * Program call.
 */
export class CallPrimitiveNode extends PrimitiveNode {
    /**
     * Name of the called program.
     */
    readonly nameToken: IdentifierPrimitiveToken | null;

    /**
     * @param nameToken Name of the called program.
     */
    constructor(nameToken: IdentifierPrimitiveToken | null) {
        super(CallPrimitiveNode.createChildren(nameToken));
        this.nameToken = nameToken;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof CallPrimitiveNode &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.nameToken, other.nameToken);
    }

    override createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): CallNode {
        return new CallNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(nameToken: IdentifierPrimitiveToken | null): ChildrenBuilder {
        const children = new ChildrenBuilder();
    
        children.addChildOrError(nameToken, "Missing name token");
    
        return children;
    }
}