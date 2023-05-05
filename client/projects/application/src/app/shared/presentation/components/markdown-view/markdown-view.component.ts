import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, ViewEncapsulation } from "@angular/core";
import { MarkdownService } from "../../../application/services/markdown-service";

@Component({
    standalone: true,
    selector: "app-markdown-view",
    imports: [CommonModule],
    templateUrl: "./markdown-view.component.html",
    styleUrls: ["./markdown-view.component.css"],
    encapsulation: ViewEncapsulation.None
})
export class MarkdownViewComponent {
    @Input()
    get source(): string {
        return this._source;
    }

    set source(value: string) {
        this._source = value;
        this.elementRef.nativeElement.innerHTML = this.markdownService.render(value);
    }

    private _source = "";

    constructor(private readonly elementRef: ElementRef, private readonly markdownService: MarkdownService) { }
}
