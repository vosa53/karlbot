import { Injectable, OnDestroy } from '@angular/core';
import { Auth, authState, signOut, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { firstValueFrom, skip, Subscription } from 'rxjs';
import { User } from '../models/user';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class SignInService implements OnDestroy {
    get currentUser(): Promise<User | null> {
        return this._currentUser;
    }

    get currentUserToken(): Promise<string | null> {
        return this._currentUserToken;
    }

    private _currentUser: Promise<User | null>;
    private _currentUserToken: Promise<string | null>;
    private authStateSubscription: Subscription | null = null;

    constructor(private readonly firebaseAuthentication: Auth, private readonly authenticationService: AuthenticationService, 
        private readonly userService: UserService) {

        this._currentUserToken = this.getCurrentUserToken();
        this._currentUser = this.getCurrentUser();

        this.authStateSubscription = authState(firebaseAuthentication).pipe(skip(1)).subscribe(u => {
            this._currentUserToken = this.getCurrentUserToken();
            this._currentUser = this.getCurrentUser();
        });
    }

    async signInWithGoogle(): Promise<void> {
        await signInWithPopup(this.firebaseAuthentication, new GoogleAuthProvider());
        await firstValueFrom(authState(this.firebaseAuthentication));
    }

    async signOut(): Promise<void> {
        await signOut(this.firebaseAuthentication);
        await firstValueFrom(authState(this.firebaseAuthentication));
    }

    ngOnDestroy() {
        this.authStateSubscription?.unsubscribe();
    }

    private async getCurrentUserToken() {
        const user = await firstValueFrom(authState(this.firebaseAuthentication));
        if (user === null)
            return null;

        const firebaseIdToken = await user.getIdToken();
        const firebaseAuthenticationResult = await this.authenticationService.firebase(firebaseIdToken);
        return firebaseAuthenticationResult.token;
    }

    private async getCurrentUser() {
        const currentUserToken = await this.currentUserToken;
        if (currentUserToken === null)
            return null;

        return this.userService.getCurrent();
    }
}
