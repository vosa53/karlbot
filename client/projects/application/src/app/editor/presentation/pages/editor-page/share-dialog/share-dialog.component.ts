import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from "@angular/material/icon";
import { NotificationService } from "projects/application/src/app/shared/presentation/services/notification.service";

/**
 * Dialog to share the open project.
 */
@Component({
    selector: "app-share-dialog",
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatIconModule],
    templateUrl: "./share-dialog.component.html",
    styleUrls: ["./share-dialog.component.css"]
})
export class ShareDialogComponent {
    /**
     * Whether the project should be public.
     */
    isProjectPublic = false;

    /**
     * URL of the project to be shared.
     */
    projectURL = "https://";

    constructor(
        readonly dialogRef: MatDialogRef<ShareDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) readonly data: ShareDialogData, 
        private readonly notificationService: NotificationService
    ) {
        this.isProjectPublic = data.isProjectPublic;
        this.projectURL = data.projectURL;
    }

    onSaveClick() {
        this.dialogRef.close(this.isProjectPublic);
    }

    onCopyProjectURLClick() {
        navigator.clipboard.writeText(this.projectURL);
        this.notificationService.show("Copied to the clipboard.");
    }
}

/**
 * Configuration of {@link ShareDialogComponent}.
 */
export interface ShareDialogData {
    /**
     * Whether the project is currently public.
     */
    readonly isProjectPublic: boolean;

    /**
     * URL of the project to be shared.
     */
    readonly projectURL: string;
}
