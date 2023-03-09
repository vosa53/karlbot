import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignInPageComponent } from './presentation/pages/sign-in-page/sign-in-page.component';
import { UserRoutingModule } from './user-routing.module';
import { MatIconModule } from '@angular/material/icon';
import { FirebaseUIModule } from 'firebaseui-angular';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';


@NgModule({
    declarations: [
        SignInPageComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        MatIconModule,
        FirebaseUIModule.forRoot({
            signInFlow: 'popup',
            signInOptions: [
                
              firebase.auth.GoogleAuthProvider.PROVIDER_ID
            ],
            tosUrl: '<your-tos-link>',
            privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
            credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
          })
    ]
})
export class UserModule { }
