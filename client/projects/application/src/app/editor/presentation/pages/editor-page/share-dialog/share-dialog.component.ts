import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-share-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent {
    isProjectPublic = false;
    projectUrl = "https://";

    constructor(readonly dialogRef: MatDialogRef<ShareDialogComponent>, @Inject(MAT_DIALOG_DATA) readonly data: ShareDialogData) {
        this.isProjectPublic = data.isProjectPublic;
        this.projectUrl = data.projectUrl;
    }

    onSaveClick() {
        this.dialogRef.close(this.isProjectPublic);
    }

    onCopyProjectUrlClick() {
        navigator.clipboard.writeText(this.projectUrl);
    }
}

export interface ShareDialogData {
    readonly isProjectPublic: boolean;
    readonly projectUrl: string;
}
