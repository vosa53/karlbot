import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_BASE_URL } from "../api-base-url";
import { FirebaseRequest } from "../models/firebase-request";
import { FirebaseReponse } from "../models/firebase-response";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly authenticationBaseUrl: string;

    constructor(private readonly httpClient: HttpClient, @Inject(API_BASE_URL) apiBaseUrl: string) {
        this.authenticationBaseUrl = `${apiBaseUrl}/authentication`;
    }

    firebase(firebaseIdToken: string): Observable<FirebaseReponse> {
        const url = `${this.authenticationBaseUrl}/firebase`;
        const request: FirebaseRequest = { firebaseIdToken };

        return this.httpClient.post<FirebaseReponse>(url, request);
    }
}