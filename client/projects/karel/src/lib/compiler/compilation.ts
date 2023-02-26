import { ExternalProgramReference } from "./external-program-reference";
import { CallNode } from "./syntax-tree/nodes/call-node";
import { CompilationUnitNode } from "./syntax-tree/nodes/compilation-unit-node";
import { Node } from "./syntax-tree/nodes/node";
import { ProgramNode } from "./syntax-tree/nodes/program-node";
import { AmbiguousSymbol } from "./symbols/ambiguous-symbol";
import { ExternalProgramSymbol } from "./symbols/external-program-symbol";
import { ProgramSymbol } from "./symbols/program-symbol";
import { Symbol } from "./symbols/symbol";
import { SymbolTable } from "./semantic-analysis/symbol-table";

/**
 * Collection of compilation units.
 */
export class Compilation {
    /**
     * Compilation units.
     */
    readonly compilationUnits: readonly CompilationUnitNode[];

    /**
     * References to external programs.
     */
    readonly externalPrograms: readonly ExternalProgramReference[];

    /**
     * Symbol table.
     */
    get symbolTable(): SymbolTable {
        return this._symbolTable = this._symbolTable ?? SymbolTable.create(this.compilationUnits, this.externalPrograms);
    }

    private _symbolTable: SymbolTable | null = null;

    /**
     * @param compilationUnits Compilation units.
     * @param externalPrograms References to external programs.
     */
    constructor(compilationUnits: readonly CompilationUnitNode[], externalPrograms: readonly ExternalProgramReference[]) {
        this.compilationUnits = compilationUnits;
        this.externalPrograms = externalPrograms;
    }

    /**
     * Creates a new compilation with added compilation unit.
     * @param compilationUnit Compilation unit to add.
     */
    addCompilationUnit(compilationUnit: CompilationUnitNode): Compilation {
        const withCompilationUnit = [...this.compilationUnits, compilationUnit];
        return new Compilation(withCompilationUnit, this.externalPrograms);
    }

    /**
     * Creates a new compilation with removed compilation unit.
     * @param compilationUnit Compilation unit to add.
     */
    removeCompilationUnit(compilationUnit: CompilationUnitNode): Compilation {
        const index = this.compilationUnits.indexOf(compilationUnit);

        if (index === -1)
           return this;

        const withoutCompilationUnit = [...this.compilationUnits];
        withoutCompilationUnit.splice(index, 1);

        return new Compilation(withoutCompilationUnit, this.externalPrograms);
    }

    /**
     * Creates a new compilation with replaced compilation unit.
     * @param oldCompilationUnit Compilation unit to be replaced.
     * @param newCompilationUnit Replacing compilation unit.
     */
    replaceCompilationUnit(oldCompilationUnit: CompilationUnitNode, newCompilationUnit: CompilationUnitNode): Compilation {
        const index = this.compilationUnits.indexOf(oldCompilationUnit);

        if (index === -1)
           return this;

        const withReplacedCompilationUnit = [...this.compilationUnits];
        withReplacedCompilationUnit[index] = newCompilationUnit;

        return new Compilation(withReplacedCompilationUnit, this.externalPrograms);
    }

    /**
     * Creates a new compilation with the given external programs.
     * @param externalPrograms External programs to be in the new compilation.
     */
    withExternalPrograms(externalPrograms: readonly ExternalProgramReference[]): Compilation {
        return new Compilation(this.compilationUnits, externalPrograms);
    }
}