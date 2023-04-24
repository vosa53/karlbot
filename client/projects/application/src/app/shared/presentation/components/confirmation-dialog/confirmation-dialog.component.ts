import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatedInputDirective } from '../../directives/validated-input.directive';

@Component({
    standalone: true,
    selector: 'app-confirmation-dialog',
    imports: [CommonModule, MatDialogModule, ValidatedInputDirective, MatButtonModule],
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) readonly data: ConfirmationDialogData) { }
}

export interface ConfirmationDialogData {
    readonly title: string;
    readonly message: string;
}