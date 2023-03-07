import { Injectable } from "@angular/core";
import { Exception } from "projects/karel/src/lib/interpreter/exception";
import { DialogService } from "../../../shared/presentation/services/dialog.service";

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
}