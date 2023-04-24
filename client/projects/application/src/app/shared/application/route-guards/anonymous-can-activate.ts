import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { SignInService } from "../services/sign-in.service";

export function anonymousCanActivate(): CanActivateFn {
    return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const signInService = inject(SignInService);
        const router = inject(Router);
        const currentUser = await firstValueFrom(signInService.currentUser$);

        if (currentUser === null)
            return true;
        else
            return router.parseUrl("/projects");
    }
};