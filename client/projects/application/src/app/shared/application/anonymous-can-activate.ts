import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { SignInService } from "./services/sign-in.service";

export const anonymousCanActivate: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const signInService = inject(SignInService);
    const router = inject(Router);
    const currentUser = await signInService.currentUser;

    if (currentUser === null)
        return true;
    else
        return router.parseUrl("/projects");
};