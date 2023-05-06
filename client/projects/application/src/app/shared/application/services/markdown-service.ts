import { Injectable } from "@angular/core";
import * as MarkdownIt from "markdown-it";

/**
 * Service for Markdown rendering.
 */
@Injectable({
    providedIn: "root"
})
export class MarkdownService {
    private readonly markdownIt: MarkdownIt;

    constructor() {
        this.markdownIt = new MarkdownIt();
    }

    /**
     * Renders Markdown into HTML.
     * @param markdownSource Markdown source.
     * @returns Output HTML.
     */
    render(markdownSource: string): string {
        return this.markdownIt.render(markdownSource);
    }
}
