import { Injectable } from "@angular/core";
import { FirebaseRequest } from "../../models/firebase-request";
import { FirebaseReponse } from "../../models/firebase-response";
import { APIService } from "./api-service";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    private readonly BASE_URL = "/authentication";

    constructor(private readonly apiService: APIService) { }

    authenticateWithFirebase(firebaseIdToken: string): Promise<FirebaseReponse> {
        const url = `${this.BASE_URL}/firebase`;
        const request: FirebaseRequest = { firebaseIdToken };

        return this.apiService.post<FirebaseReponse>(url, request, { isAnonymous: true });
    }
}