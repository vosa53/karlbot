import { Injectable } from "@angular/core";
import { DialogService } from "../../../shared/presentation/services/dialog.service";

@Injectable({
    providedIn: 'root'
})
export class EditorDialogService {
    constructor(private readonly dialogService: DialogService) { }

    showCompilationContainsErrorMessage(): Promise<void> {
        return this.dialogService.showMessage("Errors", "Compilation contains errors.");
    }
}