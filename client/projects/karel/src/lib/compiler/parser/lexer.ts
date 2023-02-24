import { ElsePrimitiveToken } from "../primitive-tokens/else-primitive-token";
import { EndOfFilePrimitiveToken } from "../primitive-tokens/end-of-file-primitive-token";
import { EndPrimitiveToken } from "../primitive-tokens/end-primitive-token";
import { IdentifierPrimitiveToken } from "../primitive-tokens/identifier-primitive-token";
import { IfPrimitiveToken } from "../primitive-tokens/if-primitive-token";
import { IsPrimitiveToken } from "../primitive-tokens/is-primitive-token";
import { NotPrimitiveToken } from "../primitive-tokens/not-primitive-token";
import { NumberPrimitiveToken } from "../primitive-tokens/number-primitive-token";
import { PrimitiveToken } from "../primitive-tokens/primitive-token";
import { ProgramPrimitiveToken } from "../primitive-tokens/program-primitive-token";
import { RepeatPrimitiveToken } from "../primitive-tokens/repeat-primitive-token";
import { TimesPrimitiveToken } from "../primitive-tokens/times-primitive-token";
import { WhilePrimitiveToken } from "../primitive-tokens/while-primitive-token";
import { EndOfLineTrivia } from "../trivia/end-of-line-trivia";
import { InvalidCharactersTrivia } from "../trivia/invalid-characters-trivia";
import { MultilineCommentTrivia } from "../trivia/multiline-comment-trivia";
import { SinglelineCommentTrivia } from "../trivia/singleline-comment-trivia";
import { Trivia } from "../trivia/trivia";
import { WhitespaceTrivia } from "../trivia/whitespace-trivia";
import { LexerContext } from "./lexer-context";

/**
 * Lexer of the Karel language. Turns a text stream into tokens.
 */
export class Lexer {
    /**
     * Tokenizes a single token from the passed context.
     * @param context Lexer context.
     * @returns Created token. Specially {@link EndOfFileToken} if the passed lexer context was at the end.
     */
    static tokenize(context: LexerContext): PrimitiveToken {
        const leadingTrivia = this.tokenizeTrivia(context, false);

        if (context.current === null)
            return new EndOfFilePrimitiveToken("", leadingTrivia, []);
        else if (this.isNumberCharacter(context.current))
            return this.tokenizeNumber(context, leadingTrivia);
        else if (this.isIdentifierCharacter(context.current))
            return this.tokenizeIdentifier(context, leadingTrivia);
        else
            throw new Error("Assertion error: This should not happen, other types of characters should be handled with leading trivia.");
    }

    private static tokenizeIdentifier(context: LexerContext, leadingTrivia: Trivia[]): PrimitiveToken {
        while (context.current !== null && this.isIdentifierCharacter(context.current))
            context.goNext();

        const text = context.collect();

        if (text === "program")
            return new ProgramPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else if (text === "if")
            return new IfPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else if (text === "else")
            return new ElsePrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else if (text === "while")
            return new WhilePrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else if (text === "repeat")
            return new RepeatPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else if (text === "times")
            return new TimesPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else if (text === "is")
            return new IsPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else if (text === "not")
            return new NotPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else if (text === "end")
            return new EndPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
        else
            return new IdentifierPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
    }

    private static tokenizeNumber(context: LexerContext, leadingTrivia: Trivia[]): NumberPrimitiveToken {
        while (context.current !== null && this.isNumberCharacter(context.current))
            context.goNext();

        const text = context.collect();
        return new NumberPrimitiveToken(text, leadingTrivia, this.tokenizeTrivia(context, true));
    }

    private static tokenizeTrivia(context: LexerContext, stopOnLineEnd: boolean) {
        const trivia: Trivia[] = [];

        while (context.current !== null) {
            if (this.isWhitespaceCharacter(context.current))
                trivia.push(this.tokenizeWhitespaceTrivia(context));
            else if (context.current === "\r" || context.current === "\n")
                trivia.push(this.tokenizeEndOfLineTrivia(context));
            else if (context.current === "/" && context.next !== null && context.next === "/")
                trivia.push(this.tokenizeSingleLineCommentTrivia(context));
            else if (context.current === "/" && context.next !== null && context.next === "*")
                trivia.push(this.tokenizeMultiLineCommentTrivia(context));
            else if (!this.isNumberCharacter(context.current) && !this.isIdentifierCharacter(context.current))
                trivia.push(this.tokenizeInvalidCharactersTrivia(context));
            else
                break;

            if (stopOnLineEnd && this.containsEndOfLine(trivia[trivia.length - 1]))
                break;
        }

        return trivia;
    }

    private static tokenizeWhitespaceTrivia(context: LexerContext): WhitespaceTrivia {
        while (context.current !== null && Lexer.isWhitespaceCharacter(context.current))
            context.goNext();

        const text = context.collect();
        return new WhitespaceTrivia(text);
    }

    private static tokenizeEndOfLineTrivia(context: LexerContext): EndOfLineTrivia {
        if (context.current === "\r" && context.next !== null && context.next == "\n")
            context.goNext();
        context.goNext();

        const text = context.collect();
        return new EndOfLineTrivia(text);
    }

    private static tokenizeSingleLineCommentTrivia(context: LexerContext): SinglelineCommentTrivia {
        context.goNext();
        context.goNext();
        while (context.current !== null && context.current !== "\n" && context.current !== "\r")
            context.goNext();

        const text = context.collect();
        return new SinglelineCommentTrivia(text);
    }

    private static tokenizeMultiLineCommentTrivia(context: LexerContext): MultilineCommentTrivia {
        context.goNext();
        context.goNext();
        while (context.current !== null && (context.current !== "*" || context.next === null || context.next !== "/"))
            context.goNext();
        if (context.next !== null) {
            context.goNext();
            context.goNext();
        }

        const text = context.collect();
        return new MultilineCommentTrivia(text);
    }

    private static tokenizeInvalidCharactersTrivia(context: LexerContext): InvalidCharactersTrivia {
        while (context.current !== null && !this.isIdentifierCharacter(context.current) && !this.isNumberCharacter(context.current) &&
            !this.isWhitespaceCharacter(context.current) && context.current !== "\n" && context.current !== "\r" &&
            !(context.current === "/" && context.next !== null && (context.next === "/" || context.next === "*")))
            context.goNext();

        const text = context.collect();
        return new InvalidCharactersTrivia(text);
    }

    private static containsEndOfLine(trivia: Trivia) {
        for (const character of trivia.text) {
            if (character === "\r" || character === "\n")
                return true;
        }
        return false;
    }

    private static isNumberCharacter(character: string) {
        return character >= "0" && character <= "9";
    }

    private static isIdentifierCharacter(character: string) {
        return character >= "a" && character <= "z" || character >= "A" && character <= "Z" || character >= "0" && character <= "9";
    }

    private static isWhitespaceCharacter(character: string) {
        return character === " ";
    }
}