import { ChallengeTestCase } from "./challenge-test-case";

export interface Challenge {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly testCases: ChallengeTestCase[] | null;
}