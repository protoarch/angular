import {isPlatformBrowser} from '@angular/common';
import {Inject, Injectable, Optional, PLATFORM_ID} from '@angular/core';
import {REQUEST} from '@nguniversal/express-engine/tokens';
import {Request} from 'express';
import {CookieService} from 'ngx-cookie';
import {AUTH_OPTIONS_DEFAULTS} from '../../auth/options-defaults.constants';
import * as AuthTokens from '../auth.tokens';
import {AuthOptions, IAuthTokenServiceInterface, User} from '../models';

const expires = new Date('31 Dec 9999 23:59:59 GMT');

// @dynamic
@Injectable()
export class CookieAuthTokenService implements IAuthTokenServiceInterface {
    private readonly _storageTokenName: string;

    isBrowser: boolean;

    constructor(
        @Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<User>,
        @Inject(PLATFORM_ID) platformId: Object,
        @Optional() @Inject(REQUEST) private req: Request,
        private cookie: CookieService,
    ) {
        const opts = options || {userType: User};
        this._storageTokenName = (opts.storageTokenName ||
            AUTH_OPTIONS_DEFAULTS.storageTokenName) as string;
        this.isBrowser = isPlatformBrowser(platformId);
    }

    saveToken(token: string): void {
        this.cookie.put(this._storageTokenName, token, {expires});
    }

    getToken(): string | null {
        if (this.isBrowser) {
            return this.cookie.get(this._storageTokenName);
        }

        const cookie = this.req.headers['cookie'];
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
