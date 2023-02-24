import { BlockPrimitiveNode } from "../primitive-nodes/block-primitive-node";
import { RepeatPrimitiveNode } from "../primitive-nodes/repeat-primitive-node";
import { NumberPrimitiveToken } from "../primitive-tokens/number-primitive-token";
import { RepeatPrimitiveToken } from "../primitive-tokens/repeat-primitive-token";
import { TimesPrimitiveToken } from "../primitive-tokens/times-primitive-token";
import { NumberToken } from "../tokens/number-token";
import { RepeatToken } from "../tokens/repeat-token";
import { TimesToken } from "../tokens/times-token";
import { BlockNode } from "./block-node";
import { Node } from "./node";

export class RepeatNode extends Node {
    get repeatToken(): RepeatToken | null {
        if (this._repeatToken === undefined)
            this.initialize();
        return this._repeatToken!;
    }

    get countToken(): NumberToken | null {
        if (this._countToken === undefined)
            this.initialize();
        return this._countToken!;
    }

    get timesToken(): TimesToken | null {
        if (this._timesToken === undefined)
            this.initialize();
        return this._timesToken!;
    }

    get body(): BlockNode | null {
        if (this._body === undefined)
            this.initialize();
        return this._body!;
    }

    private _repeatToken?: RepeatToken | null = undefined;
    private _countToken?: NumberToken | null = undefined;
    private _timesToken?: TimesToken | null = undefined;
    private _body?: BlockNode | null = undefined;

    constructor(primitiveNode: RepeatPrimitiveNode, parent: Node | null, position: number, startLine: number, startColumn: number) {
        super(primitiveNode, parent, position, startLine, startColumn);
    }

    with(newProperties: { repeatToken?: RepeatToken | null, countToken?: NumberToken | null, timesToken?: TimesToken | null, body?: BlockNode | null }): RepeatNode {
        const repeatPrimitiveNode = <RepeatPrimitiveNode>this.primitive;

        return new RepeatPrimitiveNode(
            newProperties.repeatToken === undefined ? repeatPrimitiveNode.repeatToken : <RepeatPrimitiveToken | null>(newProperties.repeatToken?.primitive ?? null),
            newProperties.countToken === undefined ? repeatPrimitiveNode.countToken : <NumberPrimitiveToken | null>(newProperties.countToken?.primitive ?? null),
            newProperties.timesToken === undefined ? repeatPrimitiveNode.timesToken : <TimesPrimitiveToken | null>(newProperties.timesToken?.primitive ?? null),
            newProperties.body === undefined ? repeatPrimitiveNode.body : <BlockPrimitiveNode | null>(newProperties.body?.primitive ?? null)
        ).createWrapper(null, 0, 1, 1);
    }

    private initialize() {
        const repeatPrimitiveNode = <RepeatPrimitiveNode>this.primitive;
        let index = 0;

        this._repeatToken = repeatPrimitiveNode.repeatToken !== null ? <RepeatToken>this.children[index] : null;
        index += repeatPrimitiveNode.repeatToken !== null ? 1 : 0;

        this._countToken = repeatPrimitiveNode.countToken !== null ? <NumberToken>this.children[index] : null;
        index += repeatPrimitiveNode.countToken !== null ? 1 : 0;

        this._timesToken = repeatPrimitiveNode.timesToken !== null ? <TimesToken>this.children[index] : null;
        index += repeatPrimitiveNode.timesToken !== null ? 1 : 0;

        this._body = repeatPrimitiveNode.body !== null ? <BlockNode>this.children[index] : null;
    }
}