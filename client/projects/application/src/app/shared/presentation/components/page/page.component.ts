import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-page",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./page.component.html",
    styleUrls: ["./page.component.css"]
})
export class PageComponent {
    @Input()
    fullWidth = false;
}
