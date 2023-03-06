import { CompletionItemType } from "./completion-item-type";

/**
 * Completion item.
 */
export class CompletionItem {
    /**
     * Inserted text.
     */
    readonly text: string;

    /**
     * Title for a user.
     */
    readonly title: string;

    /**
     * Description for a user
     */
    readonly description: string;

    /**
     * Type.
     */
    readonly type: CompletionItemType;

    /**
     * @param text Inserted text.
     * @param title Title for a user.
     * @param description Description for a user
     * @param type Type.
     */
    constructor(text: string, title: string, description: string, type: CompletionItemType) {
        this.text = text;
        this.title = title;
        this.description = description;
        this.type = type;
    }
}