import { ComponentType } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MessageDialogComponent } from "../components/message-dialog/message-dialog.component";
import { PromptDialogComponent, PromptDialogValidator } from "../components/prompt-dialog/prompt-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    constructor(private readonly dialog: MatDialog) { }

    showMessage(title: string, message: string): Promise<void> {
        return this.show(MessageDialogComponent, {
            data: { title, message }
        });
    }

    async showPrompt(title: string, message: string, validator: PromptDialogValidator): Promise<string | null> {
        const result = await this.show(PromptDialogComponent, {
            data: { title, message, validator }
        }) as string;
        return result ?? null;
    }

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