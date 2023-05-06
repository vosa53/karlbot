import { Injectable } from "@angular/core";
import { FirebaseError } from "@angular/fire/app";
import { Auth, authState, signOut, GoogleAuthProvider, signInWithPopup, User as FirebaseUser } from "@angular/fire/auth";
import { distinctUntilChanged, firstValueFrom, from, mergeMap, of, shareReplay, skip } from "rxjs";
import { AuthenticationService } from "./api/authentication.service";
import { UserService } from "./api/user.service";

/**
 * Manages current user and his session.
 */
@Injectable({
    providedIn: "root"
})
export class SignInService {
    /**
     * Token of the currently signed in user. `null` when no user is signed in.
     */
    readonly currentUserToken$ = authState(this.firebaseAuthentication).pipe(
        mergeMap(u => {
            if (u === null)
                return of(null);
            else
                return from(this.getUserToken(u));
        }),
        shareReplay(1)
    );
    
    /**
     * Currently signed in user. `null` when no user is signed in.
     */
    readonly currentUser$ = this.currentUserToken$.pipe(
        mergeMap(t => {
            if (t === null)
                return of(null);
            else
                return from(this.userService.getCurrent());
        }),
        shareReplay(1)
    );

    /**
     * @param firebaseAuthentication Firebase authentication library.
     * @param authenticationService Authentication service.
     * @param userService User service.
     */
    constructor(
        private readonly firebaseAuthentication: Auth, 
        private readonly authenticationService: AuthenticationService,
        private readonly userService: UserService
    ) { }

    /**
     * Signs the user in via a Google sign in dialog.
     * @returns 
     */
    async signInWithGoogle(): Promise<boolean> {
        try {
            await signInWithPopup(this.firebaseAuthentication, new GoogleAuthProvider());
        } catch (error) {
            if (error instanceof FirebaseError && error.code === "auth/popup-closed-by-user")
                return false;
            else
                throw error;
        }
        await this.waitForUserChange();
        return true;
    }

    /**
     * Signs the user out.
     */
    async signOut(): Promise<void> {
        await signOut(this.firebaseAuthentication);
        await this.waitForUserChange();
    }

    private async getUserToken(user: FirebaseUser): Promise<string> {
        const firebaseIdToken = await user.getIdToken();
        const firebaseAuthenticationResult = await this.authenticationService.authenticateWithFirebase(firebaseIdToken);
        return firebaseAuthenticationResult.token;
    }

    private async waitForUserChange(): Promise<void> {
        await firstValueFrom(this.currentUser$.pipe(distinctUntilChanged(), skip(1)));
    }
}
