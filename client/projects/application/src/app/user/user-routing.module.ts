import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SignInPageComponent } from "./presentation/pages/sign-in-page/sign-in-page.component";

const routes: Routes = [
    {
        path: "sign-in",
        component: SignInPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
