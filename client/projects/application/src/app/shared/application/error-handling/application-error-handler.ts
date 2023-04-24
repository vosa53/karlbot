import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, inject, Injectable, isDevMode, NgZone } from "@angular/core";
import { DialogService } from "../../presentation/services/dialog.service";
import { NotificationService } from "../../presentation/services/notification.service";

@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {
    constructor(
        private readonly notificationService: NotificationService, 
        private readonly dialogService: DialogService, 
        private readonly zone: NgZone
    ) {
        super();
    }

    override handleError(error: any) {
        super.handleError(error);

        const displayMessage = this.getDisplayMessage(error);

        this.zone.run(() => {
            this.notificationService.show(displayMessage);
            if (isDevMode())
                this.dialogService.showMessage("JavaScript error occured", error);
        });
    }

    private getDisplayMessage(error: any): string {
        if (this.isNetworkError(error))
            return "Network error! Please check if the internet connection is available.";

        return "Something went wrong!";
    }

    private isNetworkError(error: any): boolean {
        return error instanceof HttpErrorResponse && error.status === 0 ||
            error?.rejection instanceof HttpErrorResponse && error?.rejection.status === 0
    }
}