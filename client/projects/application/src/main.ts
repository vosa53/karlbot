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
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInput } from '@angular/material/input';
import { provideAnimations } from '@angular/platform-browser/animations';
import { API_BASE_URL } from './app/shared/application/api-base-url';
import { TokenInterceptor } from './app/shared/application/services/token-interceptor';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(appRoutes),
        provideHttpClient(
            withInterceptors([TokenInterceptor])
        ),
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
        { provide: FIREBASE_OPTIONS, useValue: environment.firebase },
        { provide: API_BASE_URL, useValue: "https://localhost:7105" }
    ]
});
