import { ComponentType } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../components/confirmation-dialog/confirmation-dialog.component";
import { MessageDialogComponent } from "../components/message-dialog/message-dialog.component";
import { PromptDialogComponent, PromptDialogValidator } from "../components/prompt-dialog/prompt-dialog.component";

/**
 * Service for showing dialogs.
 */
@Injectable({
    providedIn: "root"
})
export class DialogService {
    /**
     * @param dialog Angular Material dialog.
     */
    constructor(private readonly dialog: MatDialog) { }

    /**
     * Shows a dialog displaying a message.
     * @param title Tile.
     * @param message Message.
     */
    showMessage(title: string, message: string): Promise<void> {
        return this.show(MessageDialogComponent, {
            data: { title, message }
        });
    }

    /**
     * Shows a dialog with yes/no options.
     * @param title Title.
     * @param message Message
     * @returns Selected options. Yes=`true` and No=`false`. If the dialog is dismissed returns `false`.
     */
    showConfirmation(title: string, message: string): Promise<boolean> {
        return this.show(ConfirmationDialogComponent, {
            data: { title, message }
        }) ?? false;
    }

    /**
     * Shows a dialog allowing to enter a validated text.
     * @param title Title.
     * @param message Message.
     * @param text Prefilled text.
     * @param validator Text validator. Dialog does not return invalid text.
     * @returns Entered valid text or `null` if dialog was dismissed.
     */
    async showPrompt(title: string, message: string, text: string, validator: PromptDialogValidator): Promise<string | null> {
        const result = await this.show(PromptDialogComponent, {
            data: { title, message, text, validator }
        }) as string;
        return result ?? null;
    }

    /**
     * Shows a component in a dialog.
     * @param component Component.
     * @param config Dialog configuration.
     * @returns Dialog result.
     */
    show<T, D, R>(component: ComponentType<T>, config: MatDialogConfig<D>): Promise<R> {
        return new Promise(resolve => {
            const dialog = this.dialog.open(component, config);
            const subscription = dialog.afterClosed().subscribe(result => {
                subscription.unsubscribe();
                resolve(result);
            });
        });
    }
}