import { MutableTown } from "karel";

/**
 * Challenge test case for use in the challenge editor.
 */
export interface EditorChallengeTestCase {
    /**
     * Input town.
     */
    readonly inputTown: MutableTown;

    /**
     * Expected output town for the input town.
     */
    readonly outputTown: MutableTown;

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