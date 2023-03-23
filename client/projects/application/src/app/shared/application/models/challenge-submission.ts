import { Project } from "projects/karel/src/public-api";
import { ChallengeSubmissionEvaluationResult } from "./challenge-submission-evaluation-result";

export interface ChallengeSubmission {
    readonly id: number;
    readonly userId: string;
    readonly created: Date;
    readonly project: Project;
    readonly evaluationResult: ChallengeSubmissionEvaluationResult | null;
}