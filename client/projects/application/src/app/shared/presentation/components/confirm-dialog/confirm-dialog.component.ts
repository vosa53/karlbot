import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ValidatedInputDirective } from '../../directives/validated-input.directive';

@Component({
    standalone: true,
    selector: 'app-confirm-dialog',
    imports: [CommonModule, MatDialogModule, ValidatedInputDirective, MatButtonModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) readonly data: ConfirmDialogData) { }
}

export interface ConfirmDialogData {
    readonly title: string;
    readonly message: string;
}