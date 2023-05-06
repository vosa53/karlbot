import { Compilation } from "../compilation";
import { DataType } from "../data-type";
import { ExternalProgramSymbol } from "../symbols/external-program-symbol";
import { ProgramSymbol } from "../symbols/program-symbol";
import { Symbol_ } from "../symbols/symbol";
import { CompilationUnitNode } from "../syntax-tree/nodes/compilation-unit-node";
import { CompletionItem } from "./completion-item";
import { CompletionItemType } from "./completion-item-type";

/**
 * Provides Karel language services for editor.
 */
export class LanguageService {
    private readonly compilation: Compilation;

    /**
     * @param compilation Compilation.
     */
    constructor(compilation: Compilation) {
        this.compilation = compilation;
    }

    /**
     * Returns completion items at the given position.
     * @param compilationUnit Compilation unit. 
     * @param line Line.
     * @param column Column.
     */
    getCompletionItemsAt(compilationUnit: CompilationUnitNode, line: number, column: number): CompletionItem[] {
        return this.compilation
            .symbolTable
            .getDefined()
            .filter(s => !(s instanceof ProgramSymbol && s.definition.nameToken === null))
            .map(s => this.createCompletionItem(s));
    }

    private createCompletionItem(symbol: Symbol_) {
        if (symbol instanceof ExternalProgramSymbol) {
            return new CompletionItem(
                symbol.externalProgram.name, 
                symbol.externalProgram.name, 
                symbol.externalProgram.returnType === DataType.number ? "number" : "unit", 
                CompletionItemType.externalProgram
            );
        }
        else if (symbol instanceof ProgramSymbol) {
            return new CompletionItem(
                symbol.definition.nameToken!.text, 
                symbol.definition.nameToken!.text, 
                "unit", 
                CompletionItemType.program
            );
        }
        else
            throw new Error("Not supported.");
    }
}