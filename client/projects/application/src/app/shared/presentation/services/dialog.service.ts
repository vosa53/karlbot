import { ComponentType } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MessageDialogComponent } from "../components/message-dialog/message-dialog.component";

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