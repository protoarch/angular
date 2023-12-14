import {isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import {Request} from 'express';
import {CookieService} from 'ngx-cookie';

import {AUTH_OPTIONS_DEFAULTS} from '../../auth/options-defaults.constants';
import * as AuthTokens from '../auth.tokens';
import {AuthOptions, IAuthTokenServiceInterface, User} from '../models';

@Injectable({
    providedIn: 'root',
})
export class CookieAuthTokenService implements IAuthTokenServiceInterface {
    private readonly _storageTokenName: string;

    isBrowser: boolean;

    constructor(
        @Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<User>,
        @Inject(PLATFORM_ID) platformId: any,
        @Optional() @Inject('fixme') private readonly req: Request, // FIXME: ssr
        private readonly cookie: CookieService,
    ) {
        const opts = options ?? {userType: User};
        this._storageTokenName = (opts.storageTokenName ??
            AUTH_OPTIONS_DEFAULTS.storageTokenName) as string;
        this.isBrowser = isPlatformBrowser(platformId);
    }

    saveToken(token: string, expires: number): void {
        if (expires) {
            this.cookie.put(this._storageTokenName, token, {
                expires: new Date(new Date().getTime() + expires),
            });
        } else {
            this.cookie.put(this._storageTokenName, token);
        }
    }

    getToken(): string | null {
        if (this.isBrowser) {
            return this.cookie.get(this._storageTokenName) ?? null;
        }

        const cookie = this.req.headers.cookie;
        if (!cookie) {
            return null;
        }

        const elemContainsTokenName = cookie
            .split(';')
            .find((x: any) => x.includes(this._storageTokenName));
        if (elemContainsTokenName) {
            const res = elemContainsTokenName.split('=');
            if (res.length > 1) {
                return res[1];
            }
        }
        return null;
    }

    remove(): void {
        this.cookie.remove(this._storageTokenName);
    }
}
