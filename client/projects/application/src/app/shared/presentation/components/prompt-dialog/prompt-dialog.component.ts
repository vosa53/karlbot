import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-prompt-dialog',
    templateUrl: './prompt-dialog.component.html',
    styleUrls: ['./prompt-dialog.component.css']
})
export class PromptDialogComponent {
    input = "";

    constructor(readonly dialogRef: MatDialogRef<PromptDialogComponent>, @Inject(MAT_DIALOG_DATA) readonly data: PromptDialogData) { }

    onCloseClick() {
        this.dialogRef.close(this.input);
    }
}

export interface PromptDialogData {
    readonly title: string;
    message: string;
    validator: PromptDialogValidator;
}

export type PromptDialogValidator = (text: string) => boolean;