import { ArrayUtils } from "../../../utils/array-utils";
import { PrimitiveSyntaxElementUtils } from "../../../utils/primitive-syntax-element-utils";
import { ChildrenBuilder } from "../../children-builder";
import { SyntaxError } from "../../errors/syntax-error";
import { LineTextRange } from "../../line-text-range";
import { CompilationUnitNode } from "../nodes/compilation-unit-node";
import { Node } from "../nodes/node";
import { PrimitiveSyntaxElement } from "../primitive-syntax-element";
import { EndOfFilePrimitiveToken } from "../primitive-tokens/end-of-file-primitive-token";
import { PrimitiveNode } from "./primitive-node";
import { ProgramPrimitiveNode } from "./program-primitive-node";

export class CompilationUnitPrimitiveNode extends PrimitiveNode {
    readonly programs: readonly ProgramPrimitiveNode[];
    readonly endOfFileToken: EndOfFilePrimitiveToken;
    readonly filePath: string;

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

    createWrapper(parent: Node | null, position: number, startLine: number, startColumn: number): CompilationUnitNode {
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