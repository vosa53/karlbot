import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api-base-url';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly usersBaseUrl: string;

    constructor(private readonly httpClient: HttpClient, @Inject(API_BASE_URL) apiBaseUrl: string) {
        this.usersBaseUrl = `${apiBaseUrl}/users`;
    }

    getCurrent(): Observable<User> {
        const url = `${this.usersBaseUrl}/current`;
        return this.httpClient.get<User>(url);
    }
}
