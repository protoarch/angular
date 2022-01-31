import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import * as AuthTokens from '../auth.tokens';
import {AuthOptions, OAuthParams, User} from '../models';
import {AUTH_OPTIONS_DEFAULTS} from '../options-defaults.constants';

const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded',
});

@Injectable()
export class AuthApiService {
    private _stsParams: OAuthParams;
    private _tokenEndpoint: string;

    constructor(
        private httpClient: HttpClient,
        @Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<User>,
    ) {
        this._stsParams = options.stsParams as OAuthParams;
        this._tokenEndpoint = (options.tokenEndpoint ||
            AUTH_OPTIONS_DEFAULTS.tokenEndpoint) as string;
    }

    login(login: string, password: string): Observable<any> {
        return this.httpClient.post<any>(this._tokenEndpoint, this.prepareBody(login, password), {
            headers: headers,
        });
    }

    refresh(refreshToken: string) {
        return this.httpClient.post<any>(
            this._tokenEndpoint,
            this.prepareRefreshBody(refreshToken),
            {headers: headers},
        );
    }

    private prepareBody(login: string, password: string) {
        const search = new URLSearchParams();
        search.set('grant_type', 'password');
        search.set('username', login);
        search.set('password', password);
        this.convertStsParams(search);
        return search.toString();
    }

    private prepareRefreshBody(refreshToken: string) {
        const search = new URLSearchParams();
        search.set('grant_type', 'refresh_token');
        search.set('refresh_token', refreshToken);
        this.convertStsParams(search);
        return search.toString();
    }

    private convertStsParams(searchParams: URLSearchParams) {
        if (!this._stsParams) {
            return;
        }
        for (const p in this._stsParams) {
            const paramVal = (<any>this._stsParams)[p];
            if (paramVal) {
                searchParams.set(p, paramVal);
            }
        }
    }
}
