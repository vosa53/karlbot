import { Project } from "karel";
import { ChallengeSubmissionEvaluationState } from "./challenge-submission-evaluation-state";

export interface ChallengeSubmission {
    readonly id: number;
    readonly userId: string;
    readonly project: Project;
    readonly evaluatioState: ChallengeSubmissionEvaluationState;
    readonly evaluationMessage: string;
}