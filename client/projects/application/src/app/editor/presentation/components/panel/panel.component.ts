import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";

@Component({
    standalone: true,
    selector: "app-panel",
    imports: [CommonModule, MatDividerModule],
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"]
})
export class PanelComponent {
    @Input()
    header: string = "";
}
