import { importProvidersFrom } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { FirebaseUIModule } from 'firebaseui-angular';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { environment } from './environments/environment';
import firebase from 'firebase/compat/app';
import * as firebaseui from 'firebaseui';
import { provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(appRoutes),
        provideHttpClient(),
        provideAnimations(),
        importProvidersFrom(
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideAuth(() => getAuth()),
            FirebaseUIModule.forRoot({
                signInFlow: 'popup',
                signInOptions: [
                    
                  firebase.auth.GoogleAuthProvider.PROVIDER_ID
                ],
                tosUrl: '<your-tos-link>',
                privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
                credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
              }),
            MatDialogModule
        ),
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase }
    ]
});
