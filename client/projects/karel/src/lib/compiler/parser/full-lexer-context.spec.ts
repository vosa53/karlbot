import { FullLexerContext } from "./full-lexer-context";

describe("FullLexerContext", () => {
    it("current - Is set to the first character of the passed text after an instance creation.", () => {
        const context = new FullLexerContext("abc");

        expect(context.current).toBe("a");
    });

    it("current - Is null after reaching the end of the passed text.", () => {
        const context = new FullLexerContext("ab");
        context.goNext();
        context.goNext();

        expect(context.current).toBe(null);
    });

    it("next - Is the second character of the passed text after an instance creation.", () => {
        const context = new FullLexerContext("abc");

        expect(context.next).toBe("b");
    });

    it("next - Is null after reaching the last character of the passed text.", () => {
        const context = new FullLexerContext("ab");
        context.goNext();

        expect(context.next).toBe(null);
    });

    it("goNext - Moves the context by one character.", () => {
        const context = new FullLexerContext("abc");
        context.goNext();

        expect(context.current).toBe("b");
        expect(context.next).toBe("c");
    });

    it("goNext - Throws an error when the context has already reached the end.", () => {
        const context = new FullLexerContext("a");
        context.goNext();

        expect(() => context.goNext()).toThrowMatching(e => e instanceof Error);
    });

    it("collect - Returns an empty string after an instance creation.", () => {
        const context = new FullLexerContext("abc");

        expect(context.collect()).toBe("");
    });

    it("collect - Returns already processed characters (excluding the current one).", () => {
        const context = new FullLexerContext("abc");
        context.goNext();
        context.goNext();

        expect(context.collect()).toBe("ab");
    });

    it("collect - Does not return characters that were collected before.", () => {
        const context = new FullLexerContext("abcd");
        context.goNext();
        context.collect();
        context.goNext();
        context.goNext();

        expect(context.collect()).toBe("bc");
    });
});