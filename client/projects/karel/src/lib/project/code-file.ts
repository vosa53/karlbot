import { CompilationUnitNode } from "../compiler/syntax-tree/nodes/compilation-unit-node";
import { File } from "./file";

/**
 * Code file.
 */
export class CodeFile extends File {
    /**
     * Compilation unit.
     */
    readonly compilationUnit: CompilationUnitNode;

    /**
     * Numbers of lines with breakpoint. First is 1.
     */
    readonly breakpoints: readonly number[];

    /** @inheritdoc */
    get name(): string {
        return this.compilationUnit.filePath;
    }

    /**
     * @param compilationUnit Compilation unit.
     * @param breakpoints Numbers of lines with breakpoint. First is 1.
     */
    constructor(compilationUnit: CompilationUnitNode, breakpoints: readonly number[]) {
        super();
        this.compilationUnit = compilationUnit;
        this.breakpoints = breakpoints;
    }

    /** @inheritdoc */
    withName(name: string): CodeFile {
        const newCompilationUnit = this.compilationUnit.with({ filePath: name });
        return new CodeFile(newCompilationUnit, this.breakpoints);
    }

    /**
     * Creates a new code file with replaced compilation unit.
     * @param compilationUnit A new compilation unit.
     */
    withCompilationUnit(compilationUnit: CompilationUnitNode): CodeFile {
        return new CodeFile(compilationUnit, this.breakpoints);
    }

    /**
     * Creates a new code file with replaced breakpoints.
     * @param breakpoints New breakpoints.
     */
    withBreakpoints(breakpoints: readonly number[]): CodeFile {
        return new CodeFile(this.compilationUnit, breakpoints);
    }
}