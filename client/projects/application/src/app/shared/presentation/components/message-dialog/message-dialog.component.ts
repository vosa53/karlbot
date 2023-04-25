import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ValidatedInputDirective } from "../../directives/validated-input.directive";

@Component({
    standalone: true,
    selector: "app-message-dialog",
    imports: [CommonModule, MatDialogModule, ValidatedInputDirective, MatButtonModule],
    templateUrl: "./message-dialog.component.html",
    styleUrls: ["./message-dialog.component.css"]
})
export class MessageDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) readonly data: MessageDialogData) { }
}

export interface MessageDialogData {
    readonly title: string;
    readonly message: string;
}