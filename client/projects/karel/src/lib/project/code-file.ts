import { CompilationUnitNode } from '../compiler/syntax-tree/nodes/compilation-unit-node';
import { File } from './file';

/**
 * Code file.
 */
export class CodeFile extends File {
    /**
     * Compilation unit.
     */
    readonly compilationUnit: CompilationUnitNode;

    /** @inheritdoc */
    get name(): string {
        return this.compilationUnit.filePath;
    }

    /**
     * @param compilationUnit Compilation unit.
     */
    constructor(compilationUnit: CompilationUnitNode) {
        super();
        this.compilationUnit = compilationUnit;
    }

    /** @inheritdoc */
    withName(name: string): CodeFile {
        const newCompilationUnit = this.compilationUnit.with({ filePath: name });
        return new CodeFile(newCompilationUnit);
    }

    /**
     * Creates a new code file with replaced compilation unit.
     * @param compilationUnit A new compilation unit.
     */
    withCompilationUnit(compilationUnit: CompilationUnitNode): CodeFile {
        return new CodeFile(compilationUnit);
    }
}