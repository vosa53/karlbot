import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler, Injectable, isDevMode, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { DialogService } from "../../presentation/services/dialog.service";
import { NotificationService } from "../../presentation/services/notification.service";

/**
 * Global application error handler.
 * Catches errors and informs the user about the problem. In development mode shows also the details.
 */
@Injectable()
export class ApplicationErrorHandler extends ErrorHandler {
    constructor(
        private readonly router: Router,
        private readonly notificationService: NotificationService, 
        private readonly dialogService: DialogService,
        private readonly zone: NgZone
    ) {
        super();
    }

    override handleError(error: any) {
        if (this.isHTTPError(error, 404)) {
            this.router.navigateByUrl("/not-found", { skipLocationChange: true });
            return;
        }

        super.handleError(error);

        const displayMessage = this.getDisplayMessage(error);
        this.zone.run(() => {
            this.notificationService.show(displayMessage);
            if (isDevMode())
                this.dialogService.showMessage("JavaScript error occured", error);
        });
    }

    private getDisplayMessage(error: any): string {
        if (this.isHTTPError(error, 0))
            return "Network error! Please check if the internet connection is available.";

        return "Something went wrong!";
    }

    private isHTTPError(error: any, statusCode: number): boolean {
        return error instanceof HttpErrorResponse && error.status === statusCode ||
            error?.rejection instanceof HttpErrorResponse && error?.rejection.status === statusCode;
    }
}