import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, distinctUntilChanged, firstValueFrom, from, map, of, shareReplay, skip, Subscription, switchMap } from 'rxjs';
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

    constructor(private readonly firebaseAuthentication: AngularFireAuth, private readonly authenticationService: AuthenticationService, 
        private readonly userService: UserService) {

        this._currentUserToken = this.getCurrentUserToken();
        this._currentUser = this.getCurrentUser();

        this.authStateSubscription = this.firebaseAuthentication.authState.pipe(skip(1)).subscribe(u => {
            this._currentUserToken = this.getCurrentUserToken();
            this._currentUser = this.getCurrentUser();
        });
    }

    signOut() {
        this.firebaseAuthentication.signOut();
    }

    ngOnDestroy() {
        this.authStateSubscription?.unsubscribe();
    }

    private async getCurrentUserToken() {
        const user = await firstValueFrom(this.firebaseAuthentication.authState);
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
