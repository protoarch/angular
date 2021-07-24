import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AUTH_OPTIONS_DEFAULTS } from '../options-defaults.constants';
import * as AuthTokens from '../auth.tokens';
import { AuthOptions, OAuthParams, User } from '../models';


const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
});

@Injectable()
export class AuthApiService {

    private stsParams: OAuthParams;
    private tokenEndpoint: string;

    constructor(
        private httpClient: HttpClient,
        @Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<User>
    ) {
        this.stsParams = options.stsParams;
        this.tokenEndpoint = options.tokenEndpoint || AUTH_OPTIONS_DEFAULTS.tokenEndpoint;
    }

    login(login: string, password: string): Observable<any> {
        return this.httpClient.post<any>(this.tokenEndpoint, this.prepareBody(login, password), { headers: headers });
    }

    refresh(refreshToken: string) {
        return this.httpClient.post<any>(this.tokenEndpoint, this.prepareRefreshBody(refreshToken), { headers: headers });
    }

    private prepareBody(login, password) {
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
        if (!this.stsParams) {
            return;
        }
        for (let p in this.stsParams) {
            if (this.stsParams[p]) {
                searchParams.set(p, this.stsParams[p]);
            }
        }
    }
}
