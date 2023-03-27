import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom, ErrorHandler, isDevMode } from '@angular/core';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { API_BASE_URL } from './app/shared/application/api-base-url';
import { TokenInterceptor } from './app/shared/application/services/token-interceptor';
import { environment } from './environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, connectAuthEmulator, getAuth } from '@angular/fire/auth';
import { DevelopmentErrorHandler } from './app/shared/application/development-error-handler';

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(appRoutes),
        provideHttpClient(
            withInterceptors([TokenInterceptor])
        ),
        provideAnimations(),
        importProvidersFrom(
            provideFirebaseApp(() => initializeApp(environment.firebase)),
            provideAuth(() => {
                const auth = getAuth();
                if (isDevMode()) {
                    if (environment.firebaseAuthenticationEmulatorURL === null)
                        throw new Error("Emulator URL is required in development mode.");
                    
                    connectAuthEmulator(auth, environment.firebaseAuthenticationEmulatorURL, { disableWarnings: true });
                }
                return auth;
            }),
            MatDialogModule,
            MatBottomSheetModule,
            MatSnackBarModule
        ),
        { provide: API_BASE_URL, useValue: environment.apiBaseURL },
        ...(isDevMode() ? [{ provide: ErrorHandler, useClass: DevelopmentErrorHandler }] : [])
    ]
});

