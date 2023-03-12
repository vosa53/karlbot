import { ArrayUtils } from "../../../utils/array-utils";
import { PrimitiveSyntaxElementUtils } from "../../../utils/syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { EndPrimitiveToken } from "../tokens/end-token";
import { EndToken } from "../tokens/end-token";
import { Node, PrimitiveNode } from "./node";

export class BlockNode extends Node {
    get statements(): readonly Node[] {
        if (this._statements === undefined)
            this.initialize();
        return this._statements!;
    }

    get endToken(): EndToken | null {
        if (this._endToken === undefined)
            this.initialize();
        return this._endToken!;
    }

    private _statements?: Node[] = undefined;
    private _endToken?: EndToken | null = undefined;

    constructor(primitiveNode: BlockPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    with(newProperties: { statements?: readonly Node[], endToken?: EndToken | null }): BlockNode {
        const blockPrimitiveNode = <BlockPrimitiveNode>this.primitive;

        return new BlockPrimitiveNode(
            newProperties.statements === undefined ? blockPrimitiveNode.statements : newProperties.statements.map(s => <PrimitiveNode>s.primitive),
            newProperties.endToken === undefined ? blockPrimitiveNode.endToken : <EndPrimitiveToken | null>(newProperties.endToken?.primitive ?? null)
        ).createWrapper(null, 0, 1, 1);
    }

    private initialize() {
        const blockPrimitiveNode = <BlockPrimitiveNode>this.primitive;
        let index = 0;
        
        this._statements = <Node[]>this.children.slice(0, blockPrimitiveNode.statements.length);
        index += blockPrimitiveNode.statements.length;

        this._endToken = blockPrimitiveNode.endToken !== null ? <EndToken>this.children[index] : null;
    }
}


export class BlockPrimitiveNode extends PrimitiveNode {
    readonly statements: readonly PrimitiveNode[];
    readonly endToken: EndPrimitiveToken | null;

    constructor(statements: readonly PrimitiveNode[], endToken: EndPrimitiveToken | null) {
        super(BlockPrimitiveNode.createChildren(statements, endToken));
        this.statements = statements;
        this.endToken = endToken;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof BlockPrimitiveNode && 
            ArrayUtils.equals(this.statements, other.statements, (t, o) => t.equals(o)) && 
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.endToken, other.endToken);
    }

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): BlockNode {
        return new BlockNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(statements: readonly PrimitiveNode[], endToken: EndPrimitiveToken | null): ChildrenBuilder {
        const children = new ChildrenBuilder();
    
        for (const statement of statements)
            children.addChild(statement);

        children.addChildOrError(endToken, "Missing end token");
    
        return children;
    }
}