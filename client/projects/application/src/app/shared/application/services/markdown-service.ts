import { Injectable } from '@angular/core';
import * as MarkdownIt from 'markdown-it';

@Injectable({
    providedIn: 'root'
})
export class MarkdownService {
    private readonly markdownIt: MarkdownIt;

    constructor() {
        this.markdownIt = new MarkdownIt();
    }

    render(markdownSource: string): string {
        return this.markdownIt.render(markdownSource);
    }
}
