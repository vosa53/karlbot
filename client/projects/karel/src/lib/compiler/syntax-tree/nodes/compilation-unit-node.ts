import { CompilationUnitPrimitiveNode } from "../primitive-nodes/compilation-unit-primitive-node";
import { ProgramPrimitiveNode } from "../primitive-nodes/program-primitive-node";
import { EndOfFilePrimitiveToken } from "../primitive-tokens/end-of-file-primitive-token";
import { EndOfFileToken } from "../tokens/end-of-file-token";
import { Node } from "./node";
import { ProgramNode } from "./program-node";

export class CompilationUnitNode extends Node {
    get programs(): readonly ProgramNode[] {
        if (this._programs === undefined)
            this.initialize();
        return this._programs!;
    }

    get endOfFileToken(): EndOfFileToken {
        if (this._endOfFileToken === undefined)
            this.initialize();
        return this._endOfFileToken!;
    }

    get filePath(): string {
        return (<CompilationUnitPrimitiveNode>this.primitive).filePath;
    }

    private _programs?: ProgramNode[] = undefined;
    private _endOfFileToken?: EndOfFileToken = undefined;

    constructor(primitiveNode: CompilationUnitPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    with(newProperties: { programs?: readonly ProgramNode[], endOfFileToken?: EndOfFileToken, filePath?: string }): CompilationUnitNode {
        const compilationUnitPrimitiveNode = <CompilationUnitPrimitiveNode>this.primitive;

        return new CompilationUnitPrimitiveNode(
            newProperties.programs === undefined ? compilationUnitPrimitiveNode.programs : newProperties.programs.map(s => <ProgramPrimitiveNode>s.primitive),
            newProperties.endOfFileToken === undefined ? compilationUnitPrimitiveNode.endOfFileToken : <EndOfFilePrimitiveToken>newProperties.endOfFileToken.primitive,
            newProperties.filePath === undefined ? compilationUnitPrimitiveNode.filePath : newProperties.filePath
        ).createWrapper(null, 0, 1, 1);
    }

    private initialize() {
        const compilationUnitPrimitiveNode = <CompilationUnitPrimitiveNode>this.primitive;
        let index = 0;
        
        this._programs = <ProgramNode[]>this.children.slice(0, compilationUnitPrimitiveNode.programs.length);
        index += compilationUnitPrimitiveNode.programs.length;

        this._endOfFileToken = /*compilationUnitPrimitiveNode.endOfFileToken !== null ? */<EndOfFileToken>this.children[index]/* : null*/;
    }
}