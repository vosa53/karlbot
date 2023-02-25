import { Symbol } from "./symbol";

export class AmbiguousSymbol extends Symbol {
    readonly candidates: readonly Symbol[];

    constructor(candidates: Symbol[]) {
        super();
        this.candidates = candidates;
    }
}