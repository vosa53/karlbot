import { LineTextRange } from "../../text/line-text-range";
import { TestUtils } from "../../utils/test-utils";
import { Compilation } from "../compilation";
import { DataType } from "../data-type";
import { ExternalProgramReference } from "../external-program-reference";
import { CompilationUnitParser } from "../syntax-analysis/compilation-unit-parser";
import { Checker } from "./checker";

describe("Checker", () => {
    it("check - Does not return any errors when the program is valid.", () => {
        assertErrorRanges([], `
            program main
                if is condition
                    externalProgram
                    while is condition
                        externalProgram
                        externalProgram
                    end
                end
            end

            program internalProgram
                repeat 3 times    
                    externalProgram
                end
            end
        `, [new ExternalProgramReference("condition", DataType.number), new ExternalProgramReference("externalProgram", DataType.unit)]);
    });

    it("check - Detects an invalid if condition symbol type.", () => {
        assertErrorRanges([new LineTextRange(2, 11, 2, 15)], `
            program main
                if is main
                end
            end
        `);
    });

    it("check - Detects an invalid if condition data type.", () => {
        assertErrorRanges([new LineTextRange(2, 11, 2, 20)], `
            program main
                if is notNumber
                end
            end
        `, [new ExternalProgramReference("notNumber", DataType.unit)]);
    });

    it("check - Detects an invalid while condition symbol type.", () => {
        assertErrorRanges([new LineTextRange(2, 14, 2, 18)], `
            program main
                while is main
                end
            end
        `);
    });

    it("check - Detects an invalid while condition data type.", () => {
        assertErrorRanges([new LineTextRange(2, 14, 2, 23)], `
            program main
                while is notNumber
                end
            end
        `, [new ExternalProgramReference("notNumber", DataType.unit)]);
    });

    it("check - Detects an unresolved symbol.", () => {
        assertErrorRanges([new LineTextRange(2, 5, 2, 9)], `
            program main
                step
            end
        `);
    });

    it("check - Detects a program declared twice and ambiguous symbol.", () => {
        assertErrorRanges([new LineTextRange(1, 9, 1, 13), new LineTextRange(2, 5, 2, 9), new LineTextRange(4, 9, 4, 13)], `
            program prog
                prog
            end
            program prog
            end
        `);
    });

    it("check - Detects a program declared twice (two internal programs).", () => {
        assertErrorRanges([new LineTextRange(1, 9, 1, 13), new LineTextRange(3, 9, 3, 13)], `
            program prog
            end
            program prog
            end
        `);
    });

    it("check - Detects a program declared twice (one internal program and one external).", () => {
        assertErrorRanges([new LineTextRange(1, 9, 1, 13)], `
            program prog
            end
        `, [new ExternalProgramReference("prog", DataType.unit)]);
    });

    it("check - Detects a missing end token.", () => {
        assertErrorRanges([new LineTextRange(3, 1, 3, 2)], `
            program main
                main
            
        `);
    });

    it("check - Detects a skipped token.", () => {
        assertErrorRanges([new LineTextRange(1, 1, 1, 4), new LineTextRange(1, 4, 1, 6)], `
            if is
        `);
    });

    it("check - Detects an invalid characters.", () => {
        assertErrorRanges([new LineTextRange(1, 1, 1, 6)], `
            !*_/)
        `);
    });
});

function assertErrorRanges(errorRanges: LineTextRange[], sourceCode: string, externalProgramReferences: ExternalProgramReference[] = []) {
    const compilationUnit = CompilationUnitParser.parse(TestUtils.dedent(sourceCode), "TestFileName");
    const compilation = new Compilation([compilationUnit], externalProgramReferences);
    const errors = Checker.check(compilation);

    expect(errors.map(e => e.textRange)).toEqual(errorRanges);
}