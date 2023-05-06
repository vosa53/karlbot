import { HttpClient, HttpContext } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { InjectionToken } from "@angular/core";
import { IS_ANONYMOUS_ENDPOINT } from "../../http-context-tokens/is-anonymous-endpoint";

/**
 * Service for server API communication.
 */
@Injectable({
    providedIn: "root"
})
export class APIService {
    /**
     * @param httpClient HTTP client.
     * @param apiBaseURL Base URL of the API without trailing slash.
     */
    constructor(
        private readonly httpClient: HttpClient, 
        @Inject(API_BASE_URL) private readonly apiBaseURL: string
    ) { }

    /**
     * Sends a GET request to the API and returns the result.
     * @param url Url without origin.
     * @param options Request options.
     */
    get<T>(url: string, options: APIEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.get<T>(this.apiBaseURL + url, httpClientOptions);
        return lastValueFrom(observable);
    }

    /**
     * Sends a POST request to the API and returns the result.
     * @param url Url without origin.
     * @param options Request options.
     */
    post<T>(url: string, body: any, options: APIEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.post<T>(this.apiBaseURL + url, body, httpClientOptions);
        return lastValueFrom(observable);
    }

    /**
     * Sends a PUT request to the API and returns the result.
     * @param url Url without origin.
     * @param options Request options.
     */
    put<T>(url: string, body: any, options: APIEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.put<T>(this.apiBaseURL + url, body, httpClientOptions);
        return lastValueFrom(observable);
    }

    /**
     * Sends a DELETE request to the API and returns the result.
     * @param url Url without origin.
     * @param options Request options.
     */
    delete<T>(url: string, options: APIEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.delete<T>(this.apiBaseURL + url, httpClientOptions);
        return lastValueFrom(observable);
    }

    private createHttpClientOptions(options: APIEndpointOptions) {
        return {
            params: options.params,
            context: new HttpContext().set(IS_ANONYMOUS_ENDPOINT, options.isAnonymous ?? false)
        };
    }
}

/**
 * Base URL of the API without trailing slash.
 */
export const API_BASE_URL = new InjectionToken<string>("API base URL.");

/**
 * API endpoint options.
 */
export interface APIEndpointOptions {
    /**
     * Query parameters.
     */
    params?: { [param: string]: string | number },

    /**
     * Whether the authentication credentials should be omitted (default is `false`).
     */
    isAnonymous?: boolean;
}