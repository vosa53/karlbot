import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { Extension } from "@codemirror/state";

/**
 * Application CodeMirror light editor theme.
 */
export const applicationThemeLight = EditorView.theme({
    "&.cm-editor": { color: "#263238" },
    ".cm-gutters": { background: "#fafafa" },
    ".cm-lineNumbers": { color: "#B0BEC5" },
    ".cm-cursor": { borderLeftColor: "#263238" },
    ".cm-activeLine": { outlineColor: "#4a4a4a11" },
    ".cm-activeLineGutter": { color: "#37474F" },
    ".cm-selectionBackground": { background: "#E0F2F1dd" },
    "&.cm-focused .cm-selectionBackground, ::selection": { background: "#4FC3F755 !important" }, // TODO: Remove !important when the bug on the production is resolved.
    ".cm-selectionMatch": { background: "#E0F2F1bb" },
    ".cm-lintRange-error": { backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"6\" height=\"3\">%3Cpath%20d%3D%22m0%202.5%20l2%20-1.5%20l1%200%20l2%201.5%20l1%200%22%20stroke%3D%22%23f44336%22%20fill%3D%22none%22%20stroke-width%3D%222%22%2F%3E</svg>')" },
    ".cm-tooltip": { background: "white", boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)" },
    ".cm-tooltip-autocomplete > ul > li": { color: "#333333" },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": { backgroundColor: "#f5f5f5", color: "#333333" },
    ".cm-completionMatchedText": { color: "#1E88E5" },
});

/**
 * Application CodeMirror light highlight style.
 */
export const applicationHighlightStyleLight = HighlightStyle.define([
    { tag: t.keyword, color: "#1E88E5" },
    { tag: t.operatorKeyword, color: "#9C27B0" },
    { tag: t.comment, color: "#81C784" },
    { tag: t.number, color: "#FFA000" }
]);

/**
 * Application CodeMirror light style extension.
 */
export const applicationStyleLight: Extension = [applicationThemeLight, syntaxHighlighting(applicationHighlightStyleLight)];