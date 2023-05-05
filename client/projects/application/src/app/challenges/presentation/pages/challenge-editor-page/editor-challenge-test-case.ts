import { MutableTown } from "karel";

export interface EditorChallengeTestCase {
    readonly inputTown: MutableTown;
    readonly outputTown: MutableTown;
    readonly checkKarelPosition: boolean;
    readonly checkKarelDirection: boolean;
    readonly checkSigns: boolean;
    readonly isPublic: boolean;
}