import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

/**
 * Service for showing notifications.
 */
@Injectable({
    providedIn: "root"
})
export class NotificationService {
    /**
     * @param snackBar Angular Material snackbar.
     */
    constructor(private readonly snackBar: MatSnackBar) { }

    /**
     * Shows a notification.
     * @param message Message.
     */
    show(message: string): void {
        this.snackBar.open(message, undefined, { duration: 2000 });
    }
}