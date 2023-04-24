import { HttpClient, HttpContext, HttpParams, HttpRequest } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { InjectionToken } from "@angular/core";
import { IS_ANONYMOUS_ENDPOINT } from "../../http-context-tokens/is-anonymous-endpoint";

@Injectable({
    providedIn: 'root'
})
export class APIService {
    constructor(
        private readonly httpClient: HttpClient, 
        @Inject(API_BASE_URL) private readonly apiBaseURL: string
    ) { }

    get<T>(url: string, options: ApiEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.get<T>(this.apiBaseURL + url, httpClientOptions);
        return lastValueFrom(observable);
    }

    post<T>(url: string, body: any, options: ApiEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.post<T>(this.apiBaseURL + url, body, httpClientOptions);
        return lastValueFrom(observable);
    }

    put<T>(url: string, body: any, options: ApiEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.put<T>(this.apiBaseURL + url, body, httpClientOptions);
        return lastValueFrom(observable);
    }

    delete<T>(url: string, options: ApiEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.delete<T>(this.apiBaseURL + url, httpClientOptions);
        return lastValueFrom(observable);
    }

    private createHttpClientOptions(options: ApiEndpointOptions) {
        return {
            params: options.params,
            context: new HttpContext().set(IS_ANONYMOUS_ENDPOINT, options.isAnonymous ?? false)
        };
    }
}

export const API_BASE_URL = new InjectionToken<string>("API base URL.");

export interface ApiEndpointOptions {
    params?: { [param: string]: string | number },
    isAnonymous?: boolean;
}