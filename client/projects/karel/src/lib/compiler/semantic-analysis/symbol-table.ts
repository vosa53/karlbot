import { ExternalProgramReference } from "../external-program-reference";
import { AmbiguousSymbol } from "../symbols/ambiguous-symbol";
import { ExternalProgramSymbol } from "../symbols/external-program-symbol";
import { ProgramSymbol } from "../symbols/program-symbol";
import { Symbol_ } from "../symbols/symbol";
import { CallNode } from "../syntax-tree/nodes/call-node";
import { CompilationUnitNode } from "../syntax-tree/nodes/compilation-unit-node";
import { Node } from "../syntax-tree/nodes/node";
import { ProgramNode } from "../syntax-tree/nodes/program-node";

/**
 * Allows to lookup symbols associated with various syntax constructs.
 */
export class SymbolTable {
    private constructor(
        private readonly definedSymbols: readonly Symbol_[],
        private readonly programToSymbol: ReadonlyMap<ProgramNode, Symbol_>,
        private readonly nameToSymbol: ReadonlyMap<string, Symbol_>
    ) { }

    /**
     * Creates a new symbol table.
     * @param compilationUnits Compilation units.
     * @param externalPrograms References to external programs.
     */
    static create(compilationUnits: readonly CompilationUnitNode[], externalPrograms: readonly ExternalProgramReference[]): SymbolTable {
        const definedSymbols: Symbol_[] = [];
        const programToSymbol = new Map();
        const nameToSymbol = new Map();
        const nameToSymbols = new Map<string, Symbol_[]>();

        for (const compilationUnit of compilationUnits) {
            for (const program of compilationUnit.programs) {
                const symbol = new ProgramSymbol(program);
                definedSymbols.push(symbol);
                programToSymbol.set(program, symbol);

                if (program.nameToken !== null) {
                    let symbols = nameToSymbols.get(program.nameToken.text);
                    if (symbols === undefined) {
                        symbols = [];
                        nameToSymbols.set(program.nameToken.text, symbols);
                    }
                    symbols.push(symbol);
                }
            }
        }

        for (const externalProgram of externalPrograms) {
            const symbol = new ExternalProgramSymbol(externalProgram);
            definedSymbols.push(symbol);

            let symbols = nameToSymbols.get(externalProgram.name);
            if (symbols === undefined) {
                symbols = [];
                nameToSymbols.set(externalProgram.name, symbols);
            }
            symbols.push(symbol);
        }

        for (const nameToSymbolsEntry of nameToSymbols) {
            const symbol = nameToSymbolsEntry[1].length === 1 ? nameToSymbolsEntry[1][0] : new AmbiguousSymbol(nameToSymbolsEntry[1]);
            nameToSymbol.set(nameToSymbolsEntry[0], symbol);
        }

        return new SymbolTable(definedSymbols, programToSymbol, nameToSymbol);
    }

    /**
     * Returns all defined symbols.
     */
    getDefined(): readonly Symbol_[] {
        return this.definedSymbols;
    }

    /**
     * Returns a symbol bound to the given node or `null` if the node is not associated with any symbol.
     * @param node Node.
     */
    getByNode(node: Node): Symbol_ | null {
        if (node instanceof CallNode && node.nameToken !== null)
            return this.nameToSymbol.get(node.nameToken.text) ?? null;
        if (node instanceof ProgramNode)
            return this.programToSymbol.get(node) ?? null;

        return null;
    }

    /**
     * Returns a symbol bound to the given name or `null` if the name is not associated with any symbol.
     * @param name Name.
     */
    getByName(name: string): Symbol_ | null {
        return this.nameToSymbol.get(name) ?? null;
    }
}