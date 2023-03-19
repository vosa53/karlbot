import { Directive, ElementRef, Input } from '@angular/core';
import { MarkdownService } from '../../application/services/markdown-service';


@Directive({
    standalone: true,
    selector: '[appMarkdown]'
})
export class MarkdownDirective {
    @Input("appMarkdown")
    get markdownSource(): string {
        return this._markdownSource;
    }

    set markdownSource(value: string) {
        this._markdownSource = value;
        this.elementRef.nativeElement.innerHTML = this.markdownService.render(value);
    }

    private _markdownSource: string = "";

    constructor(private elementRef: ElementRef, private readonly markdownService: MarkdownService) { }
}
