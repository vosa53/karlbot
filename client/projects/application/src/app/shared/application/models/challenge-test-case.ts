import { Town } from "karel";

/**
 * Challenge test case.
 */
export interface ChallengeTestCase {
    /**
     * Input town.
     */
    readonly inputTown: Town;

    /**
     * Expected output town for the input town.
     */
    readonly outputTown: Town;

    /**
     * Whether Karel position in actual and expected output town has to match.
     */
    readonly checkKarelPosition: boolean;

    /**
     * Whether Karel direction in actual and expected output town has to match.
     */
    readonly checkKarelDirection: boolean;

    /**
     * Whether sign counts in actual and expected output town has to match.
     */
    readonly checkSigns: boolean;

    /**
     * Whether it is publicly visible (e.g. as an example test case).
     */
    readonly isPublic: boolean;
}