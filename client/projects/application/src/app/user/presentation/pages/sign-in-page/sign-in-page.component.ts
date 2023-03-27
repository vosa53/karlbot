import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SignInService } from 'projects/application/src/app/shared/application/services/sign-in.service';
import { PageComponent } from 'projects/application/src/app/shared/presentation/components/page/page.component';
import { GoogleSignInButtonComponent } from '../../components/google-sign-in-button/google-sign-in-button.component';

@Component({
    standalone: true,
    selector: 'app-sign-in-page',
    imports: [MatIconModule, PageComponent, MatCardModule, GoogleSignInButtonComponent],
    templateUrl: './sign-in-page.component.html',
    styleUrls: ['./sign-in-page.component.css']
})
export class SignInPageComponent {
    constructor(private readonly router: Router, private readonly signInService: SignInService) { }

    async onSignInWithGoogleClick() {
        await this.signInService.signInWithGoogle();
        this.router.navigateByUrl("/projects");
    }
}
