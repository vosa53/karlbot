import { Symbol_ } from "./symbol";

/**
 * Symbol for the name which refers to multiple symbols. 
 */
export class AmbiguousSymbol extends Symbol_ {
    /**
     * Symbols referred by the name.
     */
    readonly candidates: readonly Symbol_[];

    /**
     * @param candidates Symbols referred by the name.
     */
    constructor(candidates: Symbol_[]) {
        super();
        this.candidates = candidates;
    }
}