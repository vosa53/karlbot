import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { finalize } from "rxjs";
import { LoadingService } from "../services/loading-service";

/**
 * Starts loading in {@link LoadingService} during a request.
 */
export function LoadingInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    const loadingService = inject(LoadingService);
    
    loadingService.addLoading();
    return next(request).pipe(
        finalize(() => loadingService.removeLoading())
    );
}
