import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { from, of, switchMap, take } from "rxjs";
import { IS_ANONYMOUS_ENDPOINT } from "../is-anonymous-endpoint";
import { SignInService } from "./sign-in.service";

export function TokenInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn) {
    if (request.context.get(IS_ANONYMOUS_ENDPOINT))
        return next(request);

    const signInService = inject(SignInService);
    
    return from(signInService.currentUserToken).pipe(
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
