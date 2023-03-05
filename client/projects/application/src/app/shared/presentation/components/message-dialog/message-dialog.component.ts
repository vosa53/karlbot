import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-message-dialog',
    templateUrl: './message-dialog.component.html',
    styleUrls: ['./message-dialog.component.css']
})
export class MessageDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) readonly data: MessageDialogData) { }
}

export interface MessageDialogData {
    readonly title: string;
    message: string;
}