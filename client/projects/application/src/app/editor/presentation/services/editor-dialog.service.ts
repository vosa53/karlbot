import { Injectable } from "@angular/core";
import { Exception } from "projects/karel/src/lib/interpreter/exception";
import { DialogService } from "../../../shared/presentation/services/dialog.service";
import { ShareDialogComponent } from "../pages/editor-page/share-dialog/share-dialog.component";

@Injectable({
    providedIn: 'root'
})
export class EditorDialogService {
    constructor(private readonly dialogService: DialogService) { }

    showCompilationContainsErrorsMessage(): Promise<void> {
        return this.dialogService.showMessage("Errors", "Compilation contains errors.");
    }

    showSelectEntryPointMessage() {
        return this.dialogService.showMessage("Error", "Select a valid entry point.");
    }

    showSelectTownMessage() {
        return this.dialogService.showMessage("Error", "Select a town.");
    }

    showExceptionMessage(exception: Exception): Promise<void> {
        return this.dialogService.showMessage("Exception", exception.message);
    }

    showCanNotShareUnsavedProjectMessage(): Promise<void> {
        return this.dialogService.showMessage("Please save the project", "An unsaved project can not be shared. Please save it first.");
    }

    async showShare(isProjectPublic: boolean, projectUrl: string): Promise<boolean | null> {
        const result = await this.dialogService.show(ShareDialogComponent, {
            data: { isProjectPublic, projectUrl }
        }) as boolean;
        return result ?? null;
    }
}