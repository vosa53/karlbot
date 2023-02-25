import { BlockPrimitiveNode } from "../primitive-nodes/block-primitive-node";
import { ProgramPrimitiveNode } from "../primitive-nodes/program-primitive-node";
import { IdentifierPrimitiveToken } from "../primitive-tokens/identifier-primitive-token";
import { ProgramPrimitiveToken } from "../primitive-tokens/program-primitive-token";
import { IdentifierToken } from "../tokens/identifier-token";
import { ProgramToken } from "../tokens/program-token";
import { BlockNode } from "./block-node";
import { Node } from "./node";

export class ProgramNode extends Node {
    get programToken(): ProgramToken | null {
        if (this._programToken === undefined)
            this.initialize();
        return this._programToken!;
    }

    get nameToken(): IdentifierToken | null {
        if (this._nameToken === undefined)
            this.initialize();
        return this._nameToken!;
    }

    get body(): BlockNode | null {
        if (this._body === undefined)
            this.initialize();
        return this._body!;
    }

    private _programToken?: ProgramToken | null = undefined;
    private _nameToken?: IdentifierToken | null = undefined;
    private _body?: BlockNode | null = undefined;

    constructor(primitiveNode: ProgramPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    with(newProperties: { programToken?: ProgramToken | null, nameToken?: IdentifierToken | null, body?: BlockNode | null }): ProgramNode {
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