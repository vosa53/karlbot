import { Injectable } from "@angular/core";
import { DialogService } from "../../../shared/presentation/services/dialog.service";
import { ShareDialogComponent } from "../pages/editor-page/share-dialog/share-dialog.component";

/**
 * Service for showing dialogs of the editor.
 */
@Injectable({
    providedIn: "root"
})
export class EditorDialogService {
    constructor(private readonly dialogService: DialogService) { }

    /**
     * Shows a dialog to share a project.
     * @param isProjectPublic Whether the project is currently public.
     * @param projectURL URL of the project to be shared.
     * @returns Whether the project should be public. `null` when the dialog was dismissed.
     */
    async showShare(isProjectPublic: boolean, projectURL: string): Promise<boolean | null> {
        const result = await this.dialogService.show(ShareDialogComponent, {
            data: { isProjectPublic, projectURL: projectURL }
        }) as boolean;
        return result ?? null;
    }
}