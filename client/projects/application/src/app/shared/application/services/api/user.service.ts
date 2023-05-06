import { Injectable } from "@angular/core";
import { User } from "../../models/user";
import { APIService } from "./api-service";

/**
 * Service for managing users.
 */
@Injectable({
    providedIn: "root"
})
export class UserService {
    private readonly BASE_URL = "/Users";

    /**
     * @param apiService Service for server API communication.
     */
    constructor(private readonly apiService: APIService) { }

    /**
     * Returns the currently authenticated user.
     */
    getCurrent(): Promise<User> {
        const url = `${this.BASE_URL}/Current`;
        return this.apiService.get<User>(url);
    }
}
