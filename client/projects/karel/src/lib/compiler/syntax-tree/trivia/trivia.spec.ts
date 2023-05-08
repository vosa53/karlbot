import { Trivia } from "karel";

describe("Trivia", () => {
    it("constructor - Creates a new trivia with the given text.", () => {
        const trivia = new TestTrivia1("abc");
        expect(trivia.text).toBe("abc");
    });

    it("constructor - Throws an error when the text is empty.", () => {
        expect(() => new TestTrivia1("")).toThrowError();
    });

    it("equals - Returns true when trivias text and type are equal.", () => {
        const trivia1 = new TestTrivia1("abc");
        const trivia2 = new TestTrivia1("abc");

        expect(trivia1.equals(trivia2)).toBeTrue();
    });

    it("equals - Returns false when trivias text differs.", () => {
        const trivia1 = new TestTrivia1("abc");
        const trivia2 = new TestTrivia1("abcd");

        expect(trivia1.equals(trivia2)).toBeFalse();
    });

    it("equals - Returns false when trivias type differs.", () => {
        const trivia1 = new TestTrivia1("abc");
        const trivia2 = new TestTrivia2("abc");

        expect(trivia1.equals(trivia2)).toBeFalse();
    });
});

class TestTrivia1 extends Trivia { }
class TestTrivia2 extends Trivia { }