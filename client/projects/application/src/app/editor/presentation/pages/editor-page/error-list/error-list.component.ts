import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { Error } from "karel";
import { PanelComponent } from "../../../components/panel/panel.component";

@Component({
    standalone: true,
    selector: "app-error-list",
    imports: [CommonModule, MatIconModule, MatListModule, PanelComponent],
    templateUrl: "./error-list.component.html",
    styleUrls: ["./error-list.component.css"]
})
export class ErrorListComponent {
    @Input()
    errors: readonly Error[] = [];
}
