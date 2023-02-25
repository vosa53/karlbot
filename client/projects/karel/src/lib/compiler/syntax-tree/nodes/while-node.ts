import { BlockPrimitiveNode } from "../primitive-nodes/block-primitive-node";
import { CallPrimitiveNode } from "../primitive-nodes/call-primitive-node";
import { WhilePrimitiveNode } from "../primitive-nodes/while-primitive-node";
import { IsPrimitiveToken } from "../primitive-tokens/is-primitive-token";
import { NotPrimitiveToken } from "../primitive-tokens/not-primitive-token";
import { WhilePrimitiveToken } from "../primitive-tokens/while-primitive-token";
import { IsToken } from "../tokens/is-token";
import { NotToken } from "../tokens/not-token";
import { WhileToken } from "../tokens/while-token";
import { BlockNode } from "./block-node";
import { CallNode } from "./call-node";
import { Node } from "./node";

export class WhileNode extends Node {
    get whileToken(): WhileToken | null {
        if (this._whileToken === undefined)
            this.initialize();
        return this._whileToken!;
    }

    get operationToken(): IsToken | NotToken | null {
        if (this._operationToken === undefined)
            this.initialize();
        return this._operationToken!;
    }

    get condition(): CallNode | null {
        if (this._condition === undefined)
            this.initialize();
        return this._condition!;
    }

    get body(): BlockNode | null {
        if (this._body === undefined)
            this.initialize();
        return this._body!;
    }

    private _whileToken?: WhileToken | null = undefined;
    private _operationToken?: IsToken | NotToken | null = undefined;
    private _condition?: CallNode | null = undefined;
    private _body?: BlockNode | null = undefined;

    constructor(primitiveNode: WhilePrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    with(newProperties: { whileToken?: WhileToken | null, operationToken?: IsToken | NotToken | null, condition?: CallNode | null, body?: BlockNode | null }): WhileNode {
        const whilePrimitiveNode = <WhilePrimitiveNode>this.primitive;

        return new WhilePrimitiveNode(
            newProperties.whileToken === undefined ? whilePrimitiveNode.whileToken : <WhilePrimitiveToken | null>(newProperties.whileToken?.primitive ?? null),
            newProperties.operationToken === undefined ? whilePrimitiveNode.operationToken : <IsPrimitiveToken | NotPrimitiveToken | null>(newProperties.operationToken?.primitive ?? null),
            newProperties.condition === undefined ? whilePrimitiveNode.condition : <CallPrimitiveNode | null>(newProperties.condition?.primitive ?? null),
            newProperties.body === undefined ? whilePrimitiveNode.body : <BlockPrimitiveNode | null>(newProperties.body?.primitive ?? null)
        ).createWrapper(null, 0, 1, 1);
    }

    private initialize() {
        const whilePrimitiveNode = <WhilePrimitiveNode>this.primitive;
        let index = 0;

        this._whileToken = whilePrimitiveNode.whileToken !== null ? <WhileToken>this.children[index] : null;
        index += whilePrimitiveNode.whileToken !== null ? 1 : 0;

        this._operationToken = whilePrimitiveNode.operationToken !== null ? <IsToken | NotToken>this.children[index] : null;
        index += whilePrimitiveNode.operationToken !== null ? 1 : 0;

        this._condition = whilePrimitiveNode.condition !== null ? <CallNode>this.children[index] : null;
        index += whilePrimitiveNode.condition !== null ? 1 : 0;

        this._body = whilePrimitiveNode.body !== null ? <BlockNode>this.children[index] : null;
    }
}