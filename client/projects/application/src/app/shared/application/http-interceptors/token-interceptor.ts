import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { switchMap, take } from "rxjs";
import { IS_ANONYMOUS_ENDPOINT } from "../http-context-tokens/is-anonymous-endpoint";
import { SignInService } from "./../services/sign-in.service";

/**
 * Adds an authorization token from {@link SignInService.currentUserToken$} to a request. Can be disabled with {@link IS_ANONYMOUS_ENDPOINT} HTTP context token.
 */
export function TokenInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    if (request.context.get(IS_ANONYMOUS_ENDPOINT))
        return next(request);

    const signInService = inject(SignInService);
    
    return signInService.currentUserToken$.pipe(
        take(1),
        switchMap(t => {
            if (t === null)
                return next(request);
            else {
                const requestWithToken = request.clone({
                    headers: request.headers.set("Authorization", `Bearer ${t}`)
                });
                return next(requestWithToken);
            }
        })
    );
}