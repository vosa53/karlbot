import { Project } from "projects/karel/src/public-api";
import { ChallengeSubmissionEvaluationState } from "./challenge-submission-evaluation-state";

export interface ChallengeSubmission {
    readonly id: number;
    readonly userId: string;
    readonly project: Project;
    readonly evaluationState: ChallengeSubmissionEvaluationState;
    readonly evaluationMessage: string;
}