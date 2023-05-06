import { Project } from "karel";
import { ChallengeSubmissionEvaluationResult } from "./challenge-submission-evaluation-result";

/**
 * Challenge submission.
 */
export interface ChallengeSubmission {
    /**
     * ID.
     */
    readonly id: string | null;

    /**
     * ID of the user who submitted it.
     */
    readonly userId: string;

    /**
     * Date and time of submission.
     */
    readonly created: Date;

    /**
     * Submitted project file.
     */
    readonly project: Project;

    /**
     * Result of evaluation.
     */
    readonly evaluationResult: ChallengeSubmissionEvaluationResult | null;
}