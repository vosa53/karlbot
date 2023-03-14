import { HttpClient, HttpContext } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { lastValueFrom } from "rxjs";
import { IS_ANONYMOUS_ENDPOINT } from "../is-anonymous-endpoint";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private readonly httpClient: HttpClient) { }

    get<T>(url: string, options: ApiEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.get<T>(url, httpClientOptions);
        return lastValueFrom(observable);
    }

    post<T>(url: string, body: any, options: ApiEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.post<T>(url, body, httpClientOptions);
        return lastValueFrom(observable);
    }

    put<T>(url: string, body: any, options: ApiEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.put<T>(url, body, httpClientOptions);
        return lastValueFrom(observable);
    }

    delete<T>(url: string, options: ApiEndpointOptions = {}): Promise<T> {
        const httpClientOptions = this.createHttpClientOptions(options);
        const observable = this.httpClient.delete<T>(url, httpClientOptions);
        return lastValueFrom(observable);
    }

    private createHttpClientOptions(options: ApiEndpointOptions) {
        return {
            params: options.params,
            context: new HttpContext().set(IS_ANONYMOUS_ENDPOINT, options.isAnonymous ?? false)
        };
    }
}

export interface ApiEndpointOptions {
    params?: { [param: string]: string | number },
    isAnonymous?: boolean;
}