import { ChallengeDifficulty } from "./challenge-difficulty";
import { ChallengeSubmissionsInfo } from "./challenge-submissions.info";
import { ChallengeTestCase } from "./challenge-test-case";

export interface Challenge {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly difficulty: ChallengeDifficulty;
    readonly submissionsInfo: ChallengeSubmissionsInfo | null;
    readonly testCases: ChallengeTestCase[] | null;
}