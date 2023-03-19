import { MutableTown } from "projects/karel/src/public-api";

export interface EditorChallengeTestCase {
    readonly inputTown: MutableTown;
    readonly outputTown: MutableTown;
    readonly checkKarelPosition: boolean;
    readonly checkKarelDirection: boolean;
    readonly checkSigns: boolean;
    readonly isPublic: boolean;
}