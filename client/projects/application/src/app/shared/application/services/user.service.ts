import { Inject, Injectable } from '@angular/core';
import { API_BASE_URL } from '../api-base-url';
import { User } from '../models/user';
import { ApiService } from './api-service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly usersBaseUrl: string;

    constructor(private readonly apiService: ApiService, @Inject(API_BASE_URL) apiBaseUrl: string) {
        this.usersBaseUrl = `${apiBaseUrl}/users`;
    }

    getCurrent(): Promise<User> {
        const url = `${this.usersBaseUrl}/current`;
        return this.apiService.get<User>(url);
    }
}
