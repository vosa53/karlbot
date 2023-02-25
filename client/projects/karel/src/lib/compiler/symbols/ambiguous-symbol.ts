import { Symbol } from "./symbol";

/**
 * Symbol for the name which refers to multiple symbols. 
 */
export class AmbiguousSymbol extends Symbol {
    /**
     * Symbols referred by the name.
     */
    readonly candidates: readonly Symbol[];

    /**
     * @param candidates Symbols referred by the name.
     */
    constructor(candidates: Symbol[]) {
        super();
        this.candidates = candidates;
    }
}