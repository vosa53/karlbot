import { PrimitiveSyntaxElementUtils } from "../../../utils/syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { IdentifierPrimitiveToken } from "../tokens/identifier-token";
import { ProgramPrimitiveToken } from "../tokens/program-token";
import { IdentifierToken } from "../tokens/identifier-token";
import { ProgramToken } from "../tokens/program-token";
import { BlockNode, BlockPrimitiveNode } from "./block-node";
import { Node, PrimitiveNode } from "./node";

/**
 * Program declaration.
 */
export class ProgramNode extends Node {
    /**
     * `program` keyword.
     */
    get programToken(): ProgramToken | null {
        if (this._programToken === undefined)
            this.initialize();
        return this._programToken!;
    }

    /**
     * Name of the program.
     */
    get nameToken(): IdentifierToken | null {
        if (this._nameToken === undefined)
            this.initialize();
        return this._nameToken!;
    }

    /**
     * Program body.
     */
    get body(): BlockNode | null {
        if (this._body === undefined)
            this.initialize();
        return this._body!;
    }

    private _programToken?: ProgramToken | null = undefined;
    private _nameToken?: IdentifierToken | null = undefined;
    private _body?: BlockNode | null = undefined;

    /**
     * @param primitiveNode Wrapped primitive node.
     * @param parent Parent node.
     * @param position Position in the text. First is 0.
     * @param startLine Line in the text where it starts. First is 1.
     * @param startColumn Column in the text where it starts. First is 1.
     */
    constructor(primitiveNode: ProgramPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    override with(newProperties: { programToken?: ProgramToken | null, nameToken?: IdentifierToken | null, body?: BlockNode | null }): ProgramNode {
        const programPrimitiveNode = <ProgramPrimitiveNode>this.primitive;

        return new ProgramPrimitiveNode(
            newProperties.programToken === undefined ? programPrimitiveNode.programToken : <ProgramPrimitiveToken | null>(newProperties.programToken?.primitive ?? null),
            newProperties.nameToken === undefined ? programPrimitiveNode.nameToken : <IdentifierPrimitiveToken | null>(newProperties.nameToken?.primitive ?? null),
            newProperties.body === undefined ? programPrimitiveNode.body : <BlockPrimitiveNode | null>(newProperties.body?.primitive ?? null)
        ).createWrapper(null, 0, 1, 1);
    }

    private initialize() {
        const programPrimitiveNode = <ProgramPrimitiveNode>this.primitive;
        let index = 0;

        this._programToken = programPrimitiveNode.programToken !== null ? <ProgramToken>this.children[index] : null;
        index += programPrimitiveNode.programToken !== null ? 1 : 0;

        this._nameToken = programPrimitiveNode.nameToken !== null ? <IdentifierToken>this.children[index] : null;
        index += programPrimitiveNode.nameToken !== null ? 1 : 0;

        this._body = programPrimitiveNode.body !== null ? <BlockNode>this.children[index] : null;
    }
}

/**
 * Program declaration.
 */
export class ProgramPrimitiveNode extends PrimitiveNode {
    /**
     * `program` keyword.
     */
    readonly programToken: ProgramPrimitiveToken | null;

    /**
     * Name of the program.
     */
    readonly nameToken: IdentifierPrimitiveToken | null;

    /**
     * Program body.
     */
    readonly body: BlockPrimitiveNode | null;

    /**
     * @param programToken `program` keyword.
     * @param nameToken Name of the program.
     * @param body Program body.
     */
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

    override createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): ProgramNode {
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