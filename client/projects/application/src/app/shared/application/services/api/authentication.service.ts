import { Injectable } from "@angular/core";
import { FirebaseRequest } from "../../models/firebase-request";
import { FirebaseReponse } from "../../models/firebase-response";
import { APIService } from "./api-service";

/**
 * Service for users authentication.
 */
@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    private readonly BASE_URL = "/Authentication";

    /**
     * @param apiService Service for server API communication.
     */
    constructor(private readonly apiService: APIService) { }

    /**
     * Authenticates user with Firebase and returns his token.
     * @param firebaseIdToken Firebase ID token.
     */
    authenticateWithFirebase(firebaseIdToken: string): Promise<FirebaseReponse> {
        const url = `${this.BASE_URL}/Firebase`;
        const request: FirebaseRequest = { firebaseIdToken };

        return this.apiService.post<FirebaseReponse>(url, request, { isAnonymous: true });
    }
}