import { PrimitiveSyntaxElementUtils } from "../../../utils/syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { IsPrimitiveToken } from "../tokens/is-token";
import { NotPrimitiveToken } from "../tokens/not-token";
import { WhilePrimitiveToken } from "../tokens/while-token";
import { IsToken } from "../tokens/is-token";
import { NotToken } from "../tokens/not-token";
import { WhileToken } from "../tokens/while-token";
import { BlockNode, BlockPrimitiveNode } from "./block-node";
import { CallNode, CallPrimitiveNode } from "./call-node";
import { Node, PrimitiveNode } from "./node";

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