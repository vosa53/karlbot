import { BlockPrimitiveNode } from "../primitive-nodes/block-primitive-node";
import { PrimitiveNode } from "../primitive-nodes/primitive-node";
import { EndPrimitiveToken } from "../primitive-tokens/end-primitive-token";
import { EndToken } from "../tokens/end-token";
import { Node } from "./node";

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