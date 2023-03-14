import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from "@angular/router";
import { SignInService } from "./services/sign-in.service";

export const authenticatedCanActivate: CanActivateFn = async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const signInService = inject(SignInService);
    const currentUser = await signInService.currentUser;

    return currentUser !== null;
};