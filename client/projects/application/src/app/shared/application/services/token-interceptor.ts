import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { switchMap, take } from "rxjs";
import { SignInService } from "./sign-in.service";

export function TokenInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
    const signInService = inject(SignInService);

    return signInService.currentUserToken$.pipe(
        take(1),
        switchMap(t => {
            if (t === null)
                return next(req);

            const authReq = req.clone({
                headers: req.headers.set("Authorization", `Bearer ${t}`)
            });

            return next(authReq);
        })
    );
}
