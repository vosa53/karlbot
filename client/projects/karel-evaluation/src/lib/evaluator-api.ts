import { Project, ProjectDeserializer, StandardLibrary, Town, TownDeserializer } from "karel";
import { EvaluationResult } from "./evaluation/evaluation-result";
import { Evaluator } from "./evaluation/evaluator";
import { TestCase } from "./evaluation/test-case";

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

export interface TestCaseDTO {
    readonly inputTown: string;
    readonly outputTown: string;
    readonly checkKarelPosition: boolean;
    readonly checkKarelDirection: boolean;
    readonly checkSigns: boolean;
}