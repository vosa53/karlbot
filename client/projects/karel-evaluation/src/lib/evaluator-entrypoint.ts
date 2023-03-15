import { Project, ProjectDeserializer, StandardLibrary } from "karel";
import { EvaluationError } from "./evaluation-error";
import { EvaluationResult } from "./evaluation-result";

declare function evaluate(project: Project): Promise<EvaluationResult | undefined>;

export async function _evaluate(projectFile: string): Promise<EvaluationResult> {
    const standardLibraryProgramReferences = StandardLibrary.getProgramReferences();
    
    let project: Project;

    try {
        project = ProjectDeserializer.deserialize(projectFile, standardLibraryProgramReferences);
    } catch {
        return new EvaluationResult(false, "Invalid project file.");
    }

    try {
        const evaluationResult = await evaluate(project);
        if (evaluationResult !== undefined)
            return evaluationResult;
        else
            return new EvaluationResult(true, "");
    }
    catch (error) {
        if (!(error instanceof EvaluationError))
            throw error;
        
        return new EvaluationResult(false, error.message);
    }
}
