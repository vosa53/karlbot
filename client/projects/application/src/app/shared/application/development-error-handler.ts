import { ErrorHandler } from "@angular/core";

export class DevelopmentErrorHandler extends ErrorHandler {
    override handleError(error: any) {
        super.handleError(error);
        alert(error);
    }
}