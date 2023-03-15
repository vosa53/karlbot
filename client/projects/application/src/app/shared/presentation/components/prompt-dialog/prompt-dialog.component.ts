import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ValidatedInputDirective } from '../../directives/validated-input.directive';

@Component({
    standalone: true,
    selector: 'app-prompt-dialog',
    imports: [CommonModule, MatDialogModule, ValidatedInputDirective, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './prompt-dialog.component.html',
    styleUrls: ['./prompt-dialog.component.css']
})
export class PromptDialogComponent {
    text = "";

    constructor(readonly dialogRef: MatDialogRef<PromptDialogComponent>, @Inject(MAT_DIALOG_DATA) readonly data: PromptDialogData) { 
        this.text = data.text;
    }

    onCloseClick() {
        this.dialogRef.close(this.text);
    }
}

export interface PromptDialogData {
    readonly title: string;
    message: string;
    text: string;
    validator: PromptDialogValidator;
}

export type PromptDialogValidator = (text: string) => boolean;