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

export class Compilation {
    readonly compilationUnits: readonly CompilationUnitNode[];
    readonly externalPrograms: readonly ExternalProgramReference[];

    get symbolTable(): SymbolTable {
        return this._symbolTable = this._symbolTable ?? SymbolTable.create(this.compilationUnits, this.externalPrograms);
    }

    private _symbolTable: SymbolTable | null = null;

    constructor(compilationUnits: readonly CompilationUnitNode[], externalPrograms: readonly ExternalProgramReference[]) {
        this.compilationUnits = compilationUnits;
        this.externalPrograms = externalPrograms;
    }

    addCompilationUnit(compilationUnit: CompilationUnitNode): Compilation {
        const withCompilationUnit = [...this.compilationUnits, compilationUnit];
        return new Compilation(withCompilationUnit, this.externalPrograms);
    }

    removeCompilationUnit(compilationUnit: CompilationUnitNode): Compilation {
        const index = this.compilationUnits.indexOf(compilationUnit);

        if (index === -1)
           return this;

        const withoutCompilationUnit = [...this.compilationUnits];
        withoutCompilationUnit.splice(index, 1);

        return new Compilation(withoutCompilationUnit, this.externalPrograms);
    }

    replaceCompilationUnit(oldCompilationUnit: CompilationUnitNode, newCompilationUnit: CompilationUnitNode): Compilation {
        const index = this.compilationUnits.indexOf(oldCompilationUnit);

        if (index === -1)
           return this;

        const withReplacedCompilationUnit = [...this.compilationUnits];
        withReplacedCompilationUnit[index] = newCompilationUnit;

        return new Compilation(withReplacedCompilationUnit, this.externalPrograms);
    }

    withExternalPrograms(externalPrograms: readonly ExternalProgramReference[]): Compilation {
        return new Compilation(this.compilationUnits, externalPrograms);
    }
}