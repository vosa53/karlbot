import { PrimitiveToken } from "../tokens/token";
import { Trivia } from "./trivia";

/**
 * Trivia representing a token that was skipped during parsing and is not a direct part of any node.
 */
export class SkippedTokenTrivia extends Trivia {
    /**
     * Skipped token.
     */
    readonly token: PrimitiveToken;

    /**
     * @param token Skipped token. 
     */
    constructor(token: PrimitiveToken) {
        super(token.buildText());
        this.token = token;
    }
}