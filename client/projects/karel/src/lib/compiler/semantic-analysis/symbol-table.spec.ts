import { TestUtils } from "../../utils/test-utils";
import { DataType } from "../data-type";
import { ExternalProgramReference } from "../external-program-reference";
import { ExternalProgramSymbol } from "../symbols/external-program-symbol";
import { ProgramSymbol } from "../symbols/program-symbol";
import { CompilationUnitParser } from "../syntax-analysis/compilation-unit-parser";
import { SymbolTable } from "./symbol-table";

describe("SymbolTable", () => {
    it("getDefined - Returns defined program symbols.", () => {
        const compilationUnit = createCompilationUnit(`
            program someProgram
            end
            program someOtherProgram
            end
        `);
        const symbolTable = SymbolTable.create([compilationUnit], []);

        const definedSymbols = symbolTable.getDefined();

        const definedProgramsSourceCodes = definedSymbols.map(s => (s as ProgramSymbol).definition.buildText());
        expect(definedProgramsSourceCodes).toEqual(["program someProgram\nend\n", "program someOtherProgram\nend"]);
    });

    it("getDefined - Returns referenced external program symbols.", () => {
        const compilationUnit = createCompilationUnit(`

        `);
        const symbolTable = SymbolTable.create([compilationUnit], [
            new ExternalProgramReference("extProgram1", DataType.unit), 
            new ExternalProgramReference("extProgram2", DataType.number)
        ]);

        const definedSymbols = symbolTable.getDefined();

        expect(definedSymbols).toEqual([
            new ExternalProgramSymbol(new ExternalProgramReference("extProgram1", DataType.unit)),
            new ExternalProgramSymbol(new ExternalProgramReference("extProgram2", DataType.number))
        ]);
    });

    it("getByNode - Returns a program symbol from program node.", () => {
        const compilationUnit = createCompilationUnit(`
            program someProgram
            end
            program someOtherProgram
            end
        `);
        const symbolTable = SymbolTable.create([compilationUnit], []);

        const symbol = symbolTable.getByNode(compilationUnit.programs[0]);

        const programSourceCode = (symbol as ProgramSymbol).definition.buildText();
        expect(programSourceCode).toEqual("program someProgram\nend\n");
    });

    it("getByNode - Returns a program symbol from call node.", () => {
        const compilationUnit = createCompilationUnit(`
            program someProgram
                someProgram
            end
        `);
        const symbolTable = SymbolTable.create([compilationUnit], []);

        const symbol = symbolTable.getByNode(compilationUnit.programs[0].body!.statements[0]);
        
        const programSourceCode = (symbol as ProgramSymbol).definition.buildText();
        expect(programSourceCode).toEqual("program someProgram\n    someProgram\nend");
    });

    it("getByNode - Returns an external program symbol from call node.", () => {
        const compilationUnit = createCompilationUnit(`
            program someProgram
                extProgram
            end
        `);
        const symbolTable = SymbolTable.create([compilationUnit], [new ExternalProgramReference("extProgram", DataType.unit)]);

        const symbol = symbolTable.getByNode(compilationUnit.programs[0].body!.statements[0]);

        expect(symbol).toEqual(new ExternalProgramSymbol(new ExternalProgramReference("extProgram", DataType.unit)));
    });

    it("getByNode - Returns null when the node is not associated with any symbol.", () => {
        const compilationUnit = createCompilationUnit(`
            program someProgram
                repeat 2 times
                end
            end
        `);
        const symbolTable = SymbolTable.create([compilationUnit], []);

        const symbol = symbolTable.getByNode(compilationUnit.programs[0].body!.statements[0]);

        expect(symbol).toBeNull();
    });

    it("getByName - Returns a program symbol.", () => {
        const compilationUnit = createCompilationUnit(`
            program someProgram
            end
        `);
        const symbolTable = SymbolTable.create([compilationUnit], []);

        const symbol = symbolTable.getByName("someProgram");
        
        const programSourceCode = (symbol as ProgramSymbol).definition.buildText();
        expect(programSourceCode).toEqual("program someProgram\nend");
    });

    it("getByName - Returns an external program symbol.", () => {
        const compilationUnit = createCompilationUnit(`

        `);
        const symbolTable = SymbolTable.create([compilationUnit], [new ExternalProgramReference("extProgram", DataType.unit)]);

        const symbol = symbolTable.getByName("extProgram");

        expect(symbol).toEqual(new ExternalProgramSymbol(new ExternalProgramReference("extProgram", DataType.unit)));
    });

    it("getByName - Returns null when the name is not associated with any symbol.", () => {
        const compilationUnit = createCompilationUnit(`

        `);
        const symbolTable = SymbolTable.create([compilationUnit], []);

        const symbol = symbolTable.getByName("someUndefinedName");

        expect(symbol).toBeNull();
    });
});

function createCompilationUnit(sourceCode: string) {
    return CompilationUnitParser.parse(TestUtils.dedent(sourceCode), "file");
}