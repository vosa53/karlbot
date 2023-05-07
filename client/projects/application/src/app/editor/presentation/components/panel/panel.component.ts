import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatDividerModule } from "@angular/material/divider";

/**
 * Panel of the editor.
 */
@Component({
    standalone: true,
    selector: "app-panel",
    imports: [CommonModule, MatDividerModule],
    templateUrl: "./panel.component.html",
    styleUrls: ["./panel.component.css"]
})
export class PanelComponent {
    /**
     * Title of the panel.
     */
    @Input()
    header = "";
}
