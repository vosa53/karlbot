import { BlockPrimitiveNode } from "../primitive-nodes/block-primitive-node";
import { CallPrimitiveNode } from "../primitive-nodes/call-primitive-node";
import { IfPrimitiveNode } from "../primitive-nodes/if-primitive-node";
import { ElsePrimitiveToken } from "../primitive-tokens/else-primitive-token";
import { IfPrimitiveToken } from "../primitive-tokens/if-primitive-token";
import { IsPrimitiveToken } from "../primitive-tokens/is-primitive-token";
import { NotPrimitiveToken } from "../primitive-tokens/not-primitive-token";
import { ElseToken } from "../tokens/else-token";
import { IfToken } from "../tokens/if-token";
import { IsToken } from "../tokens/is-token";
import { NotToken } from "../tokens/not-token";
import { BlockNode } from "./block-node";
import { CallNode } from "./call-node";
import { Node } from "./node";

export class IfNode extends Node {
    get ifToken(): IfToken | null {
        if (this._ifToken === undefined)
            this.initialize();
        return this._ifToken!;
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

    get elseToken(): ElseToken | null {
        if (this._elseToken === undefined)
            this.initialize();
        return this._elseToken!;
    }

    get elseBody(): BlockNode | null {
        if (this._elseBody === undefined)
            this.initialize();
        return this._elseBody!;
    }

    private _ifToken?: IfToken | null = undefined;
    private _operationToken?: IsToken | NotToken | null = undefined;
    private _condition?: CallNode | null = undefined;
    private _body?: BlockNode | null = undefined;
    private _elseToken?: ElseToken | null = undefined;
    private _elseBody?: BlockNode | null = undefined;

    constructor(primitiveNode: IfPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    with(newProperties: { ifToken?: IfToken | null, operationToken?: IsToken | NotToken | null, condition?: CallNode | null, body?: BlockNode | null, elseToken?: ElseToken | null, elseBody?: BlockNode | null }): IfNode {
        const ifPrimitiveNode = <IfPrimitiveNode>this.primitive;

        return new IfPrimitiveNode(
            newProperties.ifToken === undefined ? ifPrimitiveNode.ifToken : <IfPrimitiveToken | null>(newProperties.ifToken?.primitive ?? null),
            newProperties.operationToken === undefined ? ifPrimitiveNode.operationToken : <IsPrimitiveToken | NotPrimitiveToken | null>(newProperties.operationToken?.primitive ?? null),
            newProperties.condition === undefined ? ifPrimitiveNode.condition : <CallPrimitiveNode | null>(newProperties.condition?.primitive ?? null),
            newProperties.body === undefined ? ifPrimitiveNode.body : <BlockPrimitiveNode | null>(newProperties.body?.primitive ?? null),
            newProperties.elseToken === undefined ? ifPrimitiveNode.elseToken : <ElsePrimitiveToken | null>(newProperties.elseToken?.primitive ?? null),
            newProperties.elseBody === undefined ? ifPrimitiveNode.elseBody : <BlockPrimitiveNode | null>(newProperties.elseBody?.primitive ?? null)
        ).createWrapper(null, 0, 1, 1);
    }

    private initialize() {
        const ifPrimitiveNode = <IfPrimitiveNode>this.primitive;
        let index = 0;

        this._ifToken = ifPrimitiveNode.ifToken !== null ? <IfToken>this.children[index] : null;
        index += ifPrimitiveNode.ifToken !== null ? 1 : 0;

        this._operationToken = ifPrimitiveNode.operationToken !== null ? <IsToken | NotToken>this.children[index] : null;
        index += ifPrimitiveNode.operationToken !== null ? 1 : 0;

        this._condition = ifPrimitiveNode.condition !== null ? <CallNode>this.children[index] : null;
        index += ifPrimitiveNode.condition !== null ? 1 : 0;

        this._body = ifPrimitiveNode.body !== null ? <BlockNode>this.children[index] : null;
        index += ifPrimitiveNode.body !== null ? 1 : 0;

        this._elseToken = ifPrimitiveNode.elseToken !== null ? <ElseToken>this.children[index] : null;
        index += ifPrimitiveNode.elseToken !== null ? 1 : 0;

        this._elseBody = ifPrimitiveNode.elseBody !== null ? <BlockNode>this.children[index] : null;
    }
}