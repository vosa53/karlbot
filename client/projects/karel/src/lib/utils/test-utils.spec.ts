import { TestUtils } from "./test-utils";

describe("TestUtils", () => {
    it("dedent - Ajusts a multi-line string indentation relative to the indentation of the second line and trims the first and the last line.", () => {
        const dedented = TestUtils.dedent(`
            some line
                some other line
        `);

        expect(dedented).toBe("some line\n    some other line");
    });
});