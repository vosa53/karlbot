import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageComponent } from "../../components/page/page.component";
import { HttpClient, HttpContext } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { IS_ANONYMOUS_ENDPOINT } from "../../../application/http-context-tokens/is-anonymous-endpoint";
import { MarkdownViewComponent } from "../../components/markdown-view/markdown-view.component";

/**
 * User guide describing the application usage and the Karel language.
 */
@Component({
    selector: "app-not-user-guide",
    standalone: true,
    imports: [CommonModule, PageComponent, MarkdownViewComponent],
    templateUrl: "./user-guide-page.component.html",
    styleUrls: ["./user-guide-page.component.css"]
})
export class UserGuidePageComponent implements OnInit {
    /**
     * Page content in Markdown format.
     */
    contentMarkdown = "";

    constructor(private readonly httpClient: HttpClient) { }

    async ngOnInit() {
        // Writing a long text in HTML is way too complicated, so it will be better to utilize our current Markdown rendering implementation instead. 
        const url = "/assets/shared/presentation/pages/user-guide/content.md";
        const context = new HttpContext().set(IS_ANONYMOUS_ENDPOINT, true);
        const contentObservable = this.httpClient.get(url, { responseType: "text", context });
        this.contentMarkdown = await firstValueFrom(contentObservable);
    }
}
