import { Component, Input } from "@angular/core";
import { Error } from "projects/karel/src/lib/compiler/errors/error";

@Component({
    selector: "app-error-list",
    templateUrl: "./error-list.component.html",
    styleUrls: ["./error-list.component.css"]
})
export class ErrorListComponent {
    @Input()
    errors: readonly Error[] = [];
}
