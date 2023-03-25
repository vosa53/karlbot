import { ChallengeDifficulty } from "./challenge-difficulty";
import { ChallengeTestCase } from "./challenge-test-case";

export interface Challenge {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly difficulty: ChallengeDifficulty;
    readonly testCases: ChallengeTestCase[] | null;
}