import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly currentUser = new BehaviorSubject<string | null>(null);
    readonly currentUser$ = this.currentUser.asObservable();

    constructor(private readonly auth: AngularFireAuth, private readonly httpClient: HttpClient) {
        this.auth.onAuthStateChanged(u => {
            if (u !== null)
                this.currentUser.next(u.displayName);
            else
                this.currentUser.next(null);
        });

        this.auth.authState.subscribe(u => {
            console.log(u?.getIdToken());
        });
    }

    private getToken() {

    }

    signOut() {
        //this.auth.user.subscribe(u => console.log(u));
        //this.auth.user.subscribe(u => u?.getIdToken().then(t => console.log(t)));
        //this.auth.signOut();
    }
}

interface AuthenticateFirebaseResponse {
    token: string;
}