import { Inject, Injectable } from "@angular/core";
import { API_BASE_URL } from "../api-base-url";
import { FirebaseRequest } from "../models/firebase-request";
import { FirebaseReponse } from "../models/firebase-response";
import { ApiService } from "./api-service";

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    private readonly authenticationBaseUrl: string;

    constructor(private readonly apiService: ApiService, @Inject(API_BASE_URL) apiBaseUrl: string) {
        this.authenticationBaseUrl = `${apiBaseUrl}/authentication`;
    }

    firebase(firebaseIdToken: string): Promise<FirebaseReponse> {
        const url = `${this.authenticationBaseUrl}/firebase`;
        const request: FirebaseRequest = { firebaseIdToken };

        return this.apiService.post<FirebaseReponse>(url, request, { isAnonymous: true });
    }
}