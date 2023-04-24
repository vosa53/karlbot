import { autocompletion, Completion, CompletionContext } from "@codemirror/autocomplete";
import { CompletionItem } from "karel";
import { CompletionItemType } from "karel";

type CompletionItemsProvider = (line: number, column: number) => CompletionItem[];

function handler(context: CompletionContext, completionItemsProvider: CompletionItemsProvider) {
    const identifier = context.matchBefore(/[a-zA-Z][a-zA-Z0-9]*/);
    if ((identifier === null || identifier.from == identifier.to) && !context.explicit)
        return null;

    const line = context.state.doc.lineAt(context.pos);
    const lineNumber = line.number;
    const columnNumber = context.pos - line.from + 1;
    const completionItems = completionItemsProvider(lineNumber, columnNumber);
    const codemirrorCompletionItems: Completion[] = completionItems.map(ci => {
        return {
            label: ci.text,
            detail: ci.description,
            info: ci.title,
            type: ci.type === CompletionItemType.program ? "function" : "class"
        };
    });
    return {
        from: identifier?.from ?? context.pos,
        options: codemirrorCompletionItems
    };
}

export function codeCompletion(completionItemsProvider: CompletionItemsProvider) {
    return autocompletion({ 
        override: [c => handler(c, completionItemsProvider)] 
    });
}