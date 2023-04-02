import { Project } from "projects/karel/src/public-api";
import { ChallengeSubmissionEvaluationResult } from "./challenge-submission-evaluation-result";

export interface ChallengeSubmission {
    readonly id: string | null;
    readonly userId: string;
    readonly created: Date;
    readonly project: Project;
    readonly evaluationResult: ChallengeSubmissionEvaluationResult | null;
}