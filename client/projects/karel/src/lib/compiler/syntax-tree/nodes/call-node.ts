import { CallPrimitiveNode } from "../primitive-nodes/call-primitive-node";
import { IdentifierPrimitiveToken } from "../primitive-tokens/identifier-primitive-token";
import { IdentifierToken } from "../tokens/identifier-token";
import { Node } from "./node";

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