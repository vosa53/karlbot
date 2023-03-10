import { Routes } from "@angular/router";
import { SignInPageComponent } from "./presentation/pages/sign-in-page/sign-in-page.component";

export const userRoutes: Routes = [
    {
        path: "sign-in",
        component: SignInPageComponent
    }
];