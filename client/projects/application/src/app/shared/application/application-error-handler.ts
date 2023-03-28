import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, inject, Injectable, isDevMode, NgZone } from "@angular/core";
import { DialogService } from "../presentation/services/dialog.service";
import { NotificationService } from "../presentation/services/notification.service";

@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {
    constructor(private readonly notificationService: NotificationService, private readonly dialogService: DialogService, 
        private zone: NgZone) {
        super();
    }

    override handleError(error: any) {
        super.handleError(error);

        let displayMessage = "Something went wrong!";
        if (error?.rejection instanceof HttpErrorResponse && error?.rejection.status === 0)
            displayMessage = "Network error! Please check if the internet connection is available.";

        this.zone.run(() => {
            this.notificationService.show(displayMessage);
            if (isDevMode())
                this.dialogService.showMessage("JavaScript error occured", error);
        });
    }
}