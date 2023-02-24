import { PrimitiveToken } from "../primitive-tokens/primitive-token";
import { Trivia } from "./trivia";

/**
 * Skipped token trivia.
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