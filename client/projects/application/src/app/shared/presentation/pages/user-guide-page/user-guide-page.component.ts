import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PageComponent } from "../../components/page/page.component";
import { HttpClient, HttpContext } from "@angular/common/http";
import { firstValueFrom } from "rxjs";
import { IS_ANONYMOUS_ENDPOINT } from "../../../application/http-context-tokens/is-anonymous-endpoint";
import { MarkdownViewComponent } from "../../components/markdown-view/markdown-view.component";

@Component({
    selector: "app-not-user-guide",
    standalone: true,
    imports: [CommonModule, PageComponent, MarkdownViewComponent],
    templateUrl: "./user-guide-page.component.html",
    styleUrls: ["./user-guide-page.component.css"]
})
export class UserGuidePageComponent implements OnInit {
    content = "";

    constructor(private readonly httpClient: HttpClient) { }

    async ngOnInit() {
        const url = "/assets/shared/presentation/pages/user-guide/content.md";
        const context = new HttpContext().set(IS_ANONYMOUS_ENDPOINT, true);
        const contentObservable = this.httpClient.get(url, { responseType: "text", context });
        this.content = await firstValueFrom(contentObservable);
    }
}
