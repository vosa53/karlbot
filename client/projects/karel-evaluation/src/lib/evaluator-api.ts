import { Project, ProjectDeserializer, StandardLibrary, Town, TownDeserializer } from "karel";
import { EvaluationResult } from "./evaluation/evaluation-result";
import { Evaluator } from "./evaluation/evaluator";
import { TestCase } from "./evaluation/test-case";

/**
 * Evaluates the given test cases on the given project.
 * 
 * **This is the evaluation entry point to be called from external code.**
 * @param projectJSON Project file.
 * @param testCasesJSON Array of test cases serialized to JSON. Test case format is described by the interface {@link TestCaseDTO}.
 */
export async function evaluate(projectJSON: string, testCasesJSON: string): Promise<EvaluationResult> {
    const project = deserializeProject(projectJSON);
    if (project === null)
        return new EvaluationResult(0, "System error: Project has invalid format.");

    const testCasesDTO = JSON.parse(testCasesJSON) as TestCaseDTO[];

    if (testCasesDTO.length === 0)
        return new EvaluationResult(0, "System error: No test cases were given.");

    const testCases: TestCase[] = [];
    for (const testCaseDTO of testCasesDTO) {
        const inputTown = deserializeTown(testCaseDTO.inputTown);
        const outputTown = deserializeTown(testCaseDTO.outputTown);
        if (inputTown === null || outputTown === null)
            return new EvaluationResult(0, "System error: Test case town has invalid format.");
        
        const testCase = new TestCase(inputTown, outputTown, testCaseDTO.checkKarelPosition, testCaseDTO.checkKarelDirection, testCaseDTO.checkSigns);
        testCases.push(testCase);
    }

    return await Evaluator.evaluate(project, testCases);
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

/**
 * Format of test case passed from external code.
 * 
 * For members documentation see {@link TestCase}.
 */
export interface TestCaseDTO {
    /** For documentation see {@link TestCase}. */
    readonly inputTown: string;

    /** For documentation see {@link TestCase}. */
    readonly outputTown: string;

    /** For documentation see {@link TestCase}. */
    readonly checkKarelPosition: boolean;

    /** For documentation see {@link TestCase}. */
    readonly checkKarelDirection: boolean;

    /** For documentation see {@link TestCase}. */
    readonly checkSigns: boolean;
}