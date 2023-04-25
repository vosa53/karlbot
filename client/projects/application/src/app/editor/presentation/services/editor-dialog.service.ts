import { Injectable } from "@angular/core";
import { DialogService } from "../../../shared/presentation/services/dialog.service";
import { ShareDialogComponent } from "../pages/editor-page/share-dialog/share-dialog.component";

@Injectable({
    providedIn: "root"
})
export class EditorDialogService {
    constructor(private readonly dialogService: DialogService) { }

    async showShare(isProjectPublic: boolean, projectURL: string): Promise<boolean | null> {
        const result = await this.dialogService.show(ShareDialogComponent, {
            data: { isProjectPublic, projectURL: projectURL }
        }) as boolean;
        return result ?? null;
    }
}