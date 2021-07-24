import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { CookieService } from 'ngx-cookie';

import { AUTH_OPTIONS_DEFAULTS } from '../../auth/options-defaults.constants';
import * as AuthTokens from '../auth.tokens';
import { AuthOptions, IAuthTokenServiceInterface, User } from '../models';

const expires = new Date('31 Dec 9999 23:59:59 GMT');

// @dynamic
@Injectable()
export class CookieAuthTokenService implements IAuthTokenServiceInterface {
    isBrowser: boolean;
    private readonly storageTokenName: string;

    constructor(@Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<User>,
                @Inject(PLATFORM_ID) platformId: Object,
                @Optional() @Inject(REQUEST) private req: Request,
                private cookie: CookieService) {
        const opts = options || {userType: User};
        this.storageTokenName = opts.storageTokenName || AUTH_OPTIONS_DEFAULTS.storageTokenName;
        this.isBrowser = isPlatformBrowser(platformId);
    }

    saveToken(token: string): void {
        this.cookie.put(this.storageTokenName, token, {expires});
    }

    getToken(): string {
        if (this.isBrowser) {
            return this.cookie.get(this.storageTokenName);
        }

        const cookie = this.req.headers['cookie'];
        if (!cookie) {
            return '';
        }

        const elemContainsTokenName = cookie.split(';').find(x => x.includes(this.storageTokenName));
        if (elemContainsTokenName) {
            const res = elemContainsTokenName.split('=');
            if (res.length > 1) {
                return res[1];
            }
        }
    }

    remove(): void {
        this.cookie.remove(this.storageTokenName);
    }
}
