import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { SignInService } from "../services/sign-in.service";

/**
 * Permits access only to authenticated users. If {@link requiresAdmin} is `true` then the user must be also an administrator.
 */
export function authenticatedCanActivate(requiresAdmin = false): CanActivateFn {
    return async (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
        const signInService = inject(SignInService);
        const router = inject(Router);
        const currentUser = await firstValueFrom(signInService.currentUser$);

        if (currentUser === null)
            return router.parseUrl("/user/sign-in");

        if (requiresAdmin && !currentUser.isAdmin)
            return false;
        
        return true;
    }
}