import { LineTextRange } from "../line-text-range";
import { CompilationUnitNode } from "../nodes/compilation-unit-node";

export class Error {
    readonly message: string;
    readonly compilationUnit: CompilationUnitNode;
    readonly textRange: LineTextRange;

    constructor(message: string, compilationUnit: CompilationUnitNode, textRange: LineTextRange) {
        this.message = message;
        this.compilationUnit = compilationUnit;
        this.textRange = textRange;
    }
}