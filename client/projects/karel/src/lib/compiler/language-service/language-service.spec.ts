import { TestUtils } from "../../utils/test-utils";
import { Compilation } from "../compilation";
import { DataType } from "../data-type";
import { ExternalProgramReference } from "../external-program-reference";
import { CompilationUnitParser } from "../syntax-analysis/compilation-unit-parser";
import { CompletionItem } from "./completion-item";
import { CompletionItemType } from "./completion-item-type";
import { LanguageService } from "./language-service";

describe("LanguageService", () => {
    it("getCompletionItemsAt - Returns all completion items for the given position.", () => {
        const compilation = createCompilation(`
            program program1
            end
            program program2
                if is externalProgram
                    
            end
        `, [new ExternalProgramReference("externalProgram", DataType.number)]);
        const languageService = new LanguageService(compilation);
        
        const completionItems = languageService.getCompletionItemsAt(compilation.compilationUnits[0], 5, 15);

        expect(completionItems).toEqual(jasmine.arrayWithExactContents([
            new CompletionItem("program1", "program1", "unit", CompletionItemType.program),
            new CompletionItem("program2", "program2", "unit", CompletionItemType.program),
            new CompletionItem("externalProgram", "externalProgram", "number", CompletionItemType.externalProgram)
        ]));
    });

    it("getCompletionItemsAt - Returns programs for the given position.", () => {
        const compilation = createCompilation(`
            program program1
                
            end
            program program2
            end
        `, []);
        const languageService = new LanguageService(compilation);
        
        const completionItems = languageService.getCompletionItemsAt(compilation.compilationUnits[0], 2, 5);

        expect(completionItems).toEqual(jasmine.arrayWithExactContents([
            new CompletionItem("program1", "program1", "unit", CompletionItemType.program),
            new CompletionItem("program2", "program2", "unit", CompletionItemType.program)
        ]));
    });

    it("getCompletionItemsAt - Returns external programs for the given position.", () => {
        const compilation = createCompilation(`
            program
                
            end
        `, [new ExternalProgramReference("extProgram1", DataType.number), new ExternalProgramReference("extProgram2", DataType.unit)]);
        const languageService = new LanguageService(compilation);
        
        const completionItems = languageService.getCompletionItemsAt(compilation.compilationUnits[0], 2, 5);

        expect(completionItems).toEqual(jasmine.arrayWithExactContents([
            new CompletionItem("extProgram1", "extProgram1", "number", CompletionItemType.externalProgram),
            new CompletionItem("extProgram2", "extProgram2", "unit", CompletionItemType.externalProgram)
        ]));
    });
});

function createCompilation(sourceCode: string, externalProgramReferences: ExternalProgramReference[]) {
    const compilationUnit = CompilationUnitParser.parse(TestUtils.dedent(sourceCode), "file");
    return new Compilation([compilationUnit], externalProgramReferences);
}