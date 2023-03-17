import { LineTextRange } from "../../text/line-text-range";
import { CompilationUnitNode } from "../syntax-tree/nodes/compilation-unit-node";

/**
 * General compilation error.
 */
export class Error {
    /**
     * Error message.
     */
    readonly message: string;

    /**
     * Compilation unit to which the error is related.
     */
    readonly compilationUnit: CompilationUnitNode;

    /**
     * Text range to which the error is related.
     */
    readonly textRange: LineTextRange;

    /**
     * @param message Error message.
     * @param compilationUnit Compilation unit to which the error is related.
     * @param textRange Text range to which the error is related.
     */
    constructor(message: string, compilationUnit: CompilationUnitNode, textRange: LineTextRange) {
        this.message = message;
        this.compilationUnit = compilationUnit;
        this.textRange = textRange;
    }
}