import { PrimitiveSyntaxElementUtils } from "../../../utils/syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { ElsePrimitiveToken } from "../tokens/else-token";
import { IfPrimitiveToken } from "../tokens/if-token";
import { IsPrimitiveToken } from "../tokens/is-token";
import { NotPrimitiveToken } from "../tokens/not-token";
import { ElseToken } from "../tokens/else-token";
import { IfToken } from "../tokens/if-token";
import { IsToken } from "../tokens/is-token";
import { NotToken } from "../tokens/not-token";
import { BlockNode, BlockPrimitiveNode } from "./block-node";
import { CallNode, CallPrimitiveNode } from "./call-node";
import { Node, PrimitiveNode } from "./node";

/**
 * If statement (a condition).
 */
export class IfNode extends Node {
    /**
     * `if` keyword.
     */
    get ifToken(): IfToken | null {
        if (this._ifToken === undefined)
            this.initialize();
        return this._ifToken!;
    }

    /**
     * Operation (allows to invert the condition).
     */
    get operationToken(): IsToken | NotToken | null {
        if (this._operationToken === undefined)
            this.initialize();
        return this._operationToken!;
    }

    /**
     * Condition.
     */
    get condition(): CallNode | null {
        if (this._condition === undefined)
            this.initialize();
        return this._condition!;
    }

    /**
     * Statements to execute when the condition is met.
     */
    get body(): BlockNode | null {
        if (this._body === undefined)
            this.initialize();
        return this._body!;
    }

    /**
     * `else` keyword.
     */
    get elseToken(): ElseToken | null {
        if (this._elseToken === undefined)
            this.initialize();
        return this._elseToken!;
    }

    /**
     * Statements to execute when the condition is not met.
     */
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

    /**
     * @param primitiveNode Wrapped primitive node.
     * @param parent Parent node.
     * @param position Position in the text. First is 0.
     * @param startLine Line in the text where it starts. First is 1.
     * @param startColumn Column in the text where it starts. First is 1.
     */
    constructor(primitiveNode: IfPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    override with(newProperties: { ifToken?: IfToken | null, operationToken?: IsToken | NotToken | null, condition?: CallNode | null, body?: BlockNode | null, elseToken?: ElseToken | null, elseBody?: BlockNode | null }): IfNode {
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

/**
 * If statement (a condition).
 */
export class IfPrimitiveNode extends PrimitiveNode {
    /**
     * `if` keyword.
     */
    readonly ifToken: IfPrimitiveToken | null;

    /**
     * Operation (allows to invert the condition).
     */
    readonly operationToken: IsPrimitiveToken | NotPrimitiveToken | null;

    /**
     * Condition.
     */
    readonly condition: CallPrimitiveNode | null;

    /**
     * Statements to execute when the condition is met.
     */
    readonly body: BlockPrimitiveNode | null;

    /**
     * `else` keyword.
     */
    readonly elseToken: ElsePrimitiveToken | null;

    /**
     * Statements to execute when the condition is not met.
     */
    readonly elseBody: BlockPrimitiveNode | null;

    /**
     * @param ifToken `if` keyword.
     * @param operationToken Operation (allows to invert the condition).
     * @param condition Condition.
     * @param body Statements to execute when the condition is met.
     * @param elseToken `else` keyword.
     * @param elseBody Statements to execute when the condition is not met.
     */
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

    override createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): IfNode {
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