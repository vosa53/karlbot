import { Town } from "karel";

/**
 * Test case.
 */
export class TestCase {
    /**
     * Input town.
     */
    readonly inputTown: Town;

    /**
     * Expected output town for {@link inputTown}.
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
     * @param inputTown Input town.
     * @param outputTown Expected output town for {@link inputTown}.
     * @param checkKarelPosition Whether Karel position in actual and expected output town has to match.
     * @param checkKarelDirection Whether Karel direction in actual and expected output town has to match.
     * @param checkSigns Whether sign counts in actual and expected output town has to match.
     */
    constructor(inputTown: Town, outputTown: Town, checkKarelPosition: boolean, checkKarelDirection: boolean, checkSigns: boolean) {
        this.inputTown = inputTown;
        this.outputTown = outputTown;
        this.checkKarelPosition = checkKarelPosition;
        this.checkKarelDirection = checkKarelDirection;
        this.checkSigns = checkSigns;
    }
}