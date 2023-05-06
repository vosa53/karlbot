import { KeyBinding } from "@codemirror/view";
import { indentMore, indentLess } from "@codemirror/commands";
import { acceptCompletion } from "@codemirror/autocomplete";

/**
 * CodeMirror keymap allowing code completion and indenting with Tab key.
 */
export const tabKeymap: readonly KeyBinding[] = [
    {
        key: "Tab",
        preventDefault: true,
        run: acceptCompletion,
    },
    {
        key: "Tab",
        preventDefault: true,
        run: indentMore,
    },
    {
        key: "Shift-Tab",
        preventDefault: true,
        run: indentLess,
    },
];