import { Assembly, Checker, Emitter, ExceptionInterpretResult, Interpreter, InterpretStopToken, Program, Project, ReadonlyTown, StandardLibrary } from "karel";
import { EvaluationResult } from "./evaluation-result";
import { TestCase } from "./test-case";

/**
 * Evaluates project with a set of test cases.
 */
export class Evaluator {
    /**
     * Evaluates the given test cases on the given project.
     * @param project Project.
     * @param testCases Test cases.
     */
    static async evaluate(project: Project, testCases: readonly TestCase[]): Promise<EvaluationResult> {
        if (testCases.length === 0)
            return new EvaluationResult(0, "System error: No test cases were given.");

        const errors = Checker.check(project.compilation);
        if (errors.length !== 0)
            return new EvaluationResult(0, "Project contains errors.");
    
        const assembly = Emitter.emit(project.compilation);
        const entryPoint = assembly.programs.find(p => p.name === project.settings.entryPoint);
    
        if (entryPoint === undefined)
            return new EvaluationResult(0, "No valid entry point is selected.");
    
        return await this.evaluateTestCases(testCases, assembly, entryPoint);
    }
    
    private static async evaluateTestCases(testCases: readonly TestCase[], assembly: Assembly, entryPoint: Program): Promise<EvaluationResult> {
        let message = "";
        let passedCount = 0;
        for (const testCase of testCases) {
            const town = testCase.inputTown.toMutable();
            const externalPrograms = StandardLibrary.getPrograms(town, () => 0);
            const interpreter = new Interpreter(assembly, entryPoint, externalPrograms);
            interpreter.maxCallStackSize = 1_000;
            interpreter.maxInterpretedInstructionCount = 100_000;
            
            const result = await interpreter.interpretAll(new InterpretStopToken());
    
            if (result instanceof ExceptionInterpretResult) {
                message = "Exception was thrown: " + result.exception.message;
                continue;
            }
    
            if (!this.areTownsEqual(testCase.outputTown, town, testCase))
                continue;
    
            passedCount++;
        }
    
        if (message === "" && passedCount !== testCases.length)
            message = "Invalid output for some test cases.";
    
        return new EvaluationResult(passedCount / testCases.length, message);
    }
    
    private static areTownsEqual(expected: ReadonlyTown, actual: ReadonlyTown, testCase: TestCase): boolean {
        if (testCase.checkKarelPosition && (expected.karelPosition.x !== actual.karelPosition.x || expected.karelPosition.y !== actual.karelPosition.y))
            return false;
        if (testCase.checkKarelDirection && expected.karelDirection !== actual.karelDirection)
            return false;
        if (testCase.checkSigns && (!this.areSignsEqual(expected.getSignCounts(), actual.getSignCounts()) || expected.width !== actual.width || expected.height !== actual.height))
            return false;
    
        return true;
    }
    
    private static areSignsEqual(signs1: readonly number[], signs2: readonly number[]) {
        if (signs1.length !== signs2.length)
            return false;
    
        for (let i = 0; i < signs1.length; i++) {
            if (signs1[i] !== signs2[i])
                return false;
        }
        return true;
    }
}
