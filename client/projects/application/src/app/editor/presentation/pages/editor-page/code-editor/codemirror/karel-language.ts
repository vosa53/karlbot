import { parser } from "./lezer/karel-parser";
import { styleTags, tags as t } from "@lezer/highlight";
import { LRLanguage } from "@codemirror/language";
import { LanguageSupport } from "@codemirror/language";

/**
 * Karel codemirror language.
 */
export const karelLanguage = LRLanguage.define({
    parser: parser.configure({
        props: [
            styleTags({
                identifier: t.variableName,
                SingleLineComment: t.lineComment,
                MultiLineComment: t.blockComment,
                Number: t.number,
                "program if while repeat end": t.controlKeyword,
                Operator: t.operatorKeyword,
            })/*,
            indentNodeProp.add({
                Program: delimitedIndent({ closing: "end" }),
                While: delimitedIndent({ closing: "end", }),
                If: delimitedIndent({ closing: "end" }),
                Repeat: delimitedIndent({ closing: "end" })
            })*/
        ]
    })
});

/**
 * Codemirror language support for Karel.
 */
export function karel() {
    return new LanguageSupport(karelLanguage);
}