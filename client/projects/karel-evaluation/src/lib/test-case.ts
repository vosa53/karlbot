export interface TestCase {
    readonly inputTown: string;
    readonly outputTown: string;
    readonly checkKarelPosition: boolean;
    readonly checkKarelDirection: boolean;
    readonly checkSigns: boolean;
}