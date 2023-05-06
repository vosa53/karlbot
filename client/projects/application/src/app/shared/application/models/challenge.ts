import { ChallengeDifficulty } from "./challenge-difficulty";
import { ChallengeSubmissionsInfo } from "./challenge-submissions.info";
import { ChallengeTestCase } from "./challenge-test-case";

/**
 * Challenge.
 */
export interface Challenge {
    /**
     * ID.
     */
    readonly id: string | null;

    /**
     * Name.
     */
    readonly name: string;

    /**
     * Description.
     */
    readonly description: string;

    /**
     * Difficulty.
     */
    readonly difficulty: ChallengeDifficulty;

    /**
     * Info about count of submissions.
     */
    readonly submissionsInfo: ChallengeSubmissionsInfo | null;

    /**
     * Test cases.
     */
    readonly testCases: ChallengeTestCase[] | null;
}