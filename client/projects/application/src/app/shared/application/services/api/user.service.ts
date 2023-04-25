import { Injectable } from "@angular/core";
import { User } from "../../models/user";
import { APIService } from "./api-service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private readonly BASE_URL = "/Users";

    constructor(private readonly apiService: APIService) { }

    getCurrent(): Promise<User> {
        const url = `${this.BASE_URL}/current`;
        return this.apiService.get<User>(url);
    }
}
