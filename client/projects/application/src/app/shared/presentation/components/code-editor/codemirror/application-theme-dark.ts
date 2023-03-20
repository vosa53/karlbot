import { EditorView } from "@codemirror/view";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";
import { Extension } from "@codemirror/state";

/**
 * Application Codemirror dark editor theme.
 */
export const applicationThemeDark = EditorView.theme({
    "&.cm-editor": { color: "#E0F2F1" },
    ".cm-gutters": { background: "#303030" },
    ".cm-lineNumbers": { color: "#78909C" },
    ".cm-cursor": { borderLeftColor: "#E0F2F1" },
    ".cm-activeLine": { outlineColor: "#4a4a4a77" },
    ".cm-activeLineGutter": { color: "#ECEFF1" },
    ".cm-selectionBackground": { background: "#E0F2F155" },
    "&.cm-focused .cm-selectionBackground, ::selection": { background: "#4FC3F755" },
    ".cm-selectionMatch": { background: "#E0F2F129" },
    ".cm-lintRange-error": { backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="6" height="3">%3Cpath%20d%3D%22m0%202.5%20l2%20-1.5%20l1%200%20l2%201.5%20l1%200%22%20stroke%3D%22%23f44336%22%20fill%3D%22none%22%20stroke-width%3D%222%22%2F%3E</svg>')` },
    ".cm-tooltip": { background: "#424242", boxShadow: "0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12)" },
    ".cm-tooltip-autocomplete > ul > li": { color: "#eeeeee" },
    ".cm-tooltip-autocomplete > ul > li[aria-selected]": { backgroundColor: "rgba(255, 255, 255, 0.08)", color: "#eeeeee" },
    ".cm-completionMatchedText": { color: "#4FC3F7" }
}, { dark: true });

/**
 * Application Codemirror dark highlight style.
 */
export const applicationHighlightStyleDark = HighlightStyle.define([
    { tag: t.keyword, color: "#4FC3F7" },
    { tag: t.operatorKeyword, color: "#E1BEE7" },
    { tag: t.comment, color: "#81C784" },
    { tag: t.number, color: "#FFD54F" }
]);

/**
 * Application Codemirror dark style extension.
 */
export const applicationStyleDark: Extension = [applicationThemeDark, syntaxHighlighting(applicationHighlightStyleDark)];