/**
 * Info about submission counts of challenge.
 */
export interface ChallengeSubmissionsInfo {
    /**
     * Number of own submissions.
     */
    readonly ownSubmissionCount: number;

    /**
     * Number of own successful submissions.
     */
    readonly ownSuccessfulSubmissionCount: number;

    /**
     * Total number of users who submitted.
     */
    readonly usersSubmittedCount: number;

    /**
     * Total number of users who submitted successfully.
     */
    readonly usersSuccessfullySubmittedCount: number;
}