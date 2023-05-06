import { ArrayUtils } from "../../../utils/array-utils";
import { PrimitiveSyntaxElementUtils } from "../../../utils/syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { PrimitiveSyntaxElement } from "../syntax-element";
import { EndOfFilePrimitiveToken } from "../tokens/end-of-file-token";
import { EndOfFileToken } from "../tokens/end-of-file-token";
import { Node, PrimitiveNode } from "./node";
import { ProgramNode, ProgramPrimitiveNode } from "./program-node";

/**
 * Compilation unit (abstraction of a source code file).
 */
export class CompilationUnitNode extends Node {
    /**
     * Program declarations in the compilation unit.
     */
    get programs(): readonly ProgramNode[] {
        if (this._programs === undefined)
            this.initialize();
        return this._programs!;
    }

    /**
     * End of file token.
     */
    get endOfFileToken(): EndOfFileToken {
        if (this._endOfFileToken === undefined)
            this.initialize();
        return this._endOfFileToken!;
    }

    /**
     * Path to a file corresponding to the compilation unit.
     */
    get filePath(): string {
        return (<CompilationUnitPrimitiveNode>this.primitive).filePath;
    }

    private _programs?: ProgramNode[] = undefined;
    private _endOfFileToken?: EndOfFileToken = undefined;

    /**
     * @param primitiveNode Wrapped primitive node.
     * @param parent Parent node.
     * @param position Position in the text. First is 0.
     * @param startLine Line in the text where it starts. First is 1.
     * @param startColumn Column in the text where it starts. First is 1.
     */
    constructor(primitiveNode: CompilationUnitPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    override with(newProperties: { programs?: readonly ProgramNode[], endOfFileToken?: EndOfFileToken, filePath?: string }): CompilationUnitNode {
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

/**
 * Compilation unit (abstraction of a source code file).
 */
export class CompilationUnitPrimitiveNode extends PrimitiveNode {
    /**
     * Program declarations in the compilation unit.
     */
    readonly programs: readonly ProgramPrimitiveNode[];

    /**
     * End of file token.
     */
    readonly endOfFileToken: EndOfFilePrimitiveToken;

    /**
     * Path to a file corresponding to the compilation unit.
     */
    readonly filePath: string;

    /**
     * @param programs Program declarations in the compilation unit.
     * @param endOfFileToken End of file token.
     * @param filePath Path to a file corresponding to the compilation unit.
     */
    constructor(programs: readonly ProgramPrimitiveNode[], endOfFileToken: EndOfFilePrimitiveToken, filePath: string) {
        super(CompilationUnitPrimitiveNode.createChildren(programs, endOfFileToken));
        this.programs = programs;
        this.endOfFileToken = endOfFileToken;
        this.filePath = filePath;
    }

    override equals(other: PrimitiveSyntaxElement): boolean {
        return super.equals(other) && other instanceof CompilationUnitPrimitiveNode &&
            ArrayUtils.equals(this.programs, other.programs, (t, o) => t.equals(o)) &&
            PrimitiveSyntaxElementUtils.equalsOrBothNull(this.endOfFileToken, other.endOfFileToken) &&
            this.filePath === other.filePath;
    }

    override createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): CompilationUnitNode {
        return new CompilationUnitNode(this, parent, position, startLine, startColumn);
    }

    private static createChildren(programs: readonly ProgramPrimitiveNode[], endOfFileToken: EndOfFilePrimitiveToken): ChildrenBuilder {
        const children = new ChildrenBuilder();
        
        for (const program of programs)
            children.addChild(program);
    
        children.addChildOrError(endOfFileToken, "Missing end of file token");
    
        return children;
    }
}