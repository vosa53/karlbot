import { Routes } from "@angular/router";
import { anonymousCanActivate } from "../shared/application/route-guards/anonymous-can-activate";
import { SignInPageComponent } from "./presentation/pages/sign-in-page/sign-in-page.component";

/**
 * Routes concerning the users module.
 */
export const userRoutes: Routes = [
    {
        path: "sign-in",
        component: SignInPageComponent,
        canActivate: [anonymousCanActivate()]
    }
];