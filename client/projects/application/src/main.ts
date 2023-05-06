import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { importProvidersFrom, ErrorHandler, isDevMode } from "@angular/core";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideRouter } from "@angular/router";
import { AppComponent } from "./app/app.component";
import { appRoutes } from "./app/app.routes";
import { environment } from "./environments/environment";
import { provideFirebaseApp, initializeApp } from "@angular/fire/app";
import { provideAuth, connectAuthEmulator, getAuth } from "@angular/fire/auth";
import { ApplicationErrorHandler } from "./app/shared/application/error-handling/application-error-handler";
import { LoadingInterceptor } from "./app/shared/application/http-interceptors/loading-interceptor";
import { TokenInterceptor } from "./app/shared/application/http-interceptors/token-interceptor";
import { API_BASE_URL } from "./app/shared/application/services/api/api-service";

/**
 * Application entry point.
 * 
 * Here is configured dependency injection and bootstrapped the main application component.
 */
bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(appRoutes),
        provideHttpClient(
            withInterceptors([TokenInterceptor, LoadingInterceptor])
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
        { provide: ErrorHandler, useClass: ApplicationErrorHandler }
    ]
});
