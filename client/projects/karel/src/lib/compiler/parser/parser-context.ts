import { PrimitiveToken } from "../primitive-tokens/primitive-token";

export interface ParserContext {
    readonly current: PrimitiveToken;
    goNext(): void;
    skip(): void;
}