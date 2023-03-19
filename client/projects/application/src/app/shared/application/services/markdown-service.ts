import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../api-base-url';
import { User } from '../models/user';
import { ApiService } from './api-service';
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
