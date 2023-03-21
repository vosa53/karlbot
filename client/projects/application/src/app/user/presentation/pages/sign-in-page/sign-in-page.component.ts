import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FirebaseUIModule } from 'firebaseui-angular';
import { PageComponent } from 'projects/application/src/app/shared/presentation/components/page/page.component';

@Component({
    standalone: true,
    selector: 'app-sign-in-page',
    imports: [FirebaseUIModule, MatIconModule, PageComponent, MatCardModule],
    templateUrl: './sign-in-page.component.html',
    styleUrls: ['./sign-in-page.component.css']
})
export class SignInPageComponent {
    constructor(private readonly router: Router) { }

    onSignInSuccess() {
        this.router.navigateByUrl("/projects");
    }
}
