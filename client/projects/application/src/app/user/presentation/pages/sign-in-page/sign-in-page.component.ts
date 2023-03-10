import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseUIModule } from 'firebaseui-angular';

@Component({
    standalone: true,
    selector: 'app-sign-in-page',
    imports: [FirebaseUIModule, MatIconModule],
    templateUrl: './sign-in-page.component.html',
    styleUrls: ['./sign-in-page.component.css']
})
export class SignInPageComponent {

}
