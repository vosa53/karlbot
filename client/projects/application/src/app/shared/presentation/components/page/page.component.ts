import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

/**
 * Page skeleton. Use an element with `page-title` attribute to provide a title.
 */
@Component({
    selector: "app-page",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./page.component.html",
    styleUrls: ["./page.component.css"]
})
export class PageComponent {
    /**
     * Whether the page should span full screen width. Default is `false`.
     */
    @Input()
    fullWidth = false;
}
