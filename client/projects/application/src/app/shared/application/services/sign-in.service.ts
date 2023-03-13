import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, distinctUntilChanged, from, map, of, shareReplay, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class SignInService {
    private readonly currentUserToken = new BehaviorSubject<string | null>(null);
    readonly currentUserToken$ = this.currentUserToken.asObservable();

    readonly currentUser$ = this.currentUserToken$.pipe(
        switchMap(t => {
            if (t === null)
                return of(null);
            else 
                return this.userService.getCurrent();
        }),
        shareReplay(1)
    );

    constructor(private readonly firebaseAuthentication: AngularFireAuth, private readonly authenticationService: AuthenticationService, 
        private readonly userService: UserService) {
            this.firebaseAuthentication.authState.pipe(
                switchMap(u => {
                    if (u === null)
                        return of(null);
                    else 
                        return from(u.getIdToken());
                }),
                switchMap(t => {
                    if (t === null)
                        return of(null);
                    else 
                        return this.authenticationService.firebase(t);
                }),
                map(fr => fr?.token ?? null),
                shareReplay(1)
            ).subscribe(t => this.currentUserToken.next(t));
    }

    signOut() {
        this.firebaseAuthentication.signOut();
    }
}
