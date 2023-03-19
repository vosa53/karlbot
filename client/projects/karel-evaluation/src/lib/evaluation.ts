import { Assembly, Checker, Emitter, ExceptionInterpretResult, Interpreter, InterpretStopToken, Program, Project, ProjectDeserializer, ReadonlyTown, StandardLibrary, Town, TownDirection } from "karel";
import { TownDeserializer } from "karel";
import { EvaluationResult } from "./evaluation-result";
import { TestCase } from "./test-case";

export async function evaluate(projectFile: string, testCasesJSON: string): Promise<EvaluationResult> {
    const project = deserializeProject(projectFile);
    if (project === null)
        return new EvaluationResult(0, "Invalid project file.");

    const testCases = JSON.parse(testCasesJSON) as TestCase[];

    const errors = Checker.check(project.compilation);
    if (errors.length !== 0)
        return new EvaluationResult(0, "Project contains errors.");

    const assembly = Emitter.emit(project.compilation);
    const entryPoint = assembly.programs.find(p => p.name === project.settings.entryPoint);

    if (entryPoint === undefined)
        return new EvaluationResult(0, "No valid entry point is selected.");

    return await evaluateTestCases(testCases, assembly, entryPoint);
}

async function evaluateTestCases(testCases: TestCase[], assembly: Assembly, entryPoint: Program): Promise<EvaluationResult> {
    let message = "";
    let passedCount = 0;
    for (const testCase of testCases) {
        const inputTown = deserializeTown(testCase.inputTown);
        const outputTown = deserializeTown(testCase.outputTown);
        if (inputTown === null || outputTown === null) {
            message = "System error: Test case town is invalid.";
            continue;
        }

        const town = inputTown.toMutable();
        const externalPrograms = StandardLibrary.getPrograms(town, () => 0);
        const interpreter = new Interpreter(assembly, entryPoint, externalPrograms);
        
        const result = await interpreter.interpretAll(new InterpretStopToken());

        if (result instanceof ExceptionInterpretResult) {
            message = "Exception was thrown: " + result.exception.message;
            continue;
        }

        if (!areSame(outputTown, town, testCase))
            continue;

        passedCount++;
    }

    if (message === "" && passedCount !== testCases.length)
        message = "Invalid output for some test cases.";

    return new EvaluationResult(passedCount / testCases.length, message);
}

function areSame(expected: ReadonlyTown, actual: ReadonlyTown, testCase: TestCase): boolean {
    if (testCase.checkKarelPosition && (expected.karelPosition.x !== actual.karelPosition.x || expected.karelPosition.y !== actual.karelPosition.y))
        return false;
    if (testCase.checkKarelDirection && expected.karelDirection !== actual.karelDirection)
        return false;
    if (testCase.checkSigns && !areSignsEqual(expected.getSignCounts(), actual.getSignCounts()))
        return false;

    return true;
}

function areSignsEqual(signs1: readonly number[], signs2: readonly number[]) {
    if (signs1.length !== signs2.length)
        return false;

    for (let i = 0; i < signs1.length; i++) {
        if (signs1[i] !== signs2[i])
            return false;
    }
    return true;
}

function deserializeProject(project: string): Project | null {
    try {
        return ProjectDeserializer.deserialize(project, StandardLibrary.getProgramReferences());
    } catch {
        return null;
    }
}

function deserializeTown(town: string): Town | null {
    try {
        return TownDeserializer.deserialize(town);
    } catch {
        return null;
    }
}