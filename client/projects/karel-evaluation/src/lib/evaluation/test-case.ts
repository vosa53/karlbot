import { Town } from "karel";

export class TestCase {
    readonly inputTown: Town;
    readonly outputTown: Town;
    readonly checkKarelPosition: boolean;
    readonly checkKarelDirection: boolean;
    readonly checkSigns: boolean;

    constructor(inputTown: Town, outputTown: Town, checkKarelPosition: boolean, checkKarelDirection: boolean, checkSigns: boolean) {
        this.inputTown = inputTown;
        this.outputTown = outputTown;
        this.checkKarelPosition = checkKarelPosition;
        this.checkKarelDirection = checkKarelDirection;
        this.checkSigns = checkSigns;
    }
}