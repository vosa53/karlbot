import { Town } from "projects/karel/src/public-api";

export interface ChallengeTestCase {
    readonly inputTown: Town;
    readonly outputTown: Town;
    readonly checkKarelPosition: boolean;
    readonly checkKarelDirection: boolean;
    readonly checkSigns: boolean;
    readonly isPublic: boolean;
}