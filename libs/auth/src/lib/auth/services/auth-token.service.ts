import { Inject, Injectable } from '@angular/core';

import { AUTH_OPTIONS_DEFAULTS } from '../options-defaults.constants';
import * as AuthTokens from '../auth.tokens';
import { AuthOptions, IAuthTokenServiceInterface, User } from '../models';

@Injectable()
export class AuthTokenService implements IAuthTokenServiceInterface {
    private readonly storageTokenName: string;

    constructor(@Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<User>) {
        const opts = options || {userType: User};
        this.storageTokenName = opts.storageTokenName || AUTH_OPTIONS_DEFAULTS.storageTokenName;
    }

    saveToken(token: string): void {
        return localStorage.setItem(this.storageTokenName, token);
    }

    getToken(): string {
        return localStorage.getItem(this.storageTokenName);
    }

    remove(): void {
        localStorage.removeItem(this.storageTokenName);
    }
}
