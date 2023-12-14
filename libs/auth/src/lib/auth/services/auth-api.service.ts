import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as AuthTokens from '../auth.tokens';
import {AuthOptions, OAuthParams, User} from '../models';
import {IAuthApiService} from '../models/auth-api.service';
import {AUTH_OPTIONS_DEFAULTS} from '../options-defaults.constants';

const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
});

@Injectable({
    providedIn: 'root',
})
export class AuthApiService implements IAuthApiService {
    private readonly _requestParams: OAuthParams;
    private readonly _tokenEndpoint: string;

    constructor(
        private readonly httpClient: HttpClient,
        @Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<User>,
    ) {
        this._requestParams = options.oauthRequestParams as OAuthParams;
        this._tokenEndpoint = (options.tokenEndpoint ??
            AUTH_OPTIONS_DEFAULTS.tokenEndpoint) as string;
    }

    login(login: string, password: string): Observable<any> {
        return this.httpClient.post<any>(this._tokenEndpoint, this.prepareBody(login, password), {
            headers,
        });
    }

    refresh(refreshToken: string) {
        return this.httpClient.post<any>(
            this._tokenEndpoint,
            this.prepareRefreshBody(refreshToken),
            {headers},
        );
    }

    private prepareBody(login: string, password: string) {
        const search = new URLSearchParams();
        search.set('grant_type', 'password');
        search.set('username', login);
        search.set('password', password);
        this.convertoauthRequestParams(search);
        return search.toString();
    }

    private prepareRefreshBody(refreshToken: string) {
        const search = new URLSearchParams();
        search.set('grant_type', 'refresh_token');
        search.set('refresh_token', refreshToken);
        this.convertoauthRequestParams(search);
        return search.toString();
    }

    private convertoauthRequestParams(searchParams: URLSearchParams) {
        if (!this._requestParams) {
            return;
        }
        for (const p in this._requestParams) {
            const paramVal = (this._requestParams as any)[p];
            if (paramVal) {
                searchParams.set(p, paramVal);
            }
        }
    }
}
