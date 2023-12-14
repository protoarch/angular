import { Inject, Injectable } from '@angular/core';
import * as AuthTokens from '../auth.tokens';
import { AuthOptions, IAuthTokenServiceInterface, User } from '../models';
import { AUTH_OPTIONS_DEFAULTS } from '../options-defaults.constants';

@Injectable({
    providedIn: 'root',
})
export class AuthTokenService implements IAuthTokenServiceInterface {
    private readonly _storageTokenName: string;

    constructor(@Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<User>) {
        const opts = options || { userType: User };
        this._storageTokenName = (opts.storageTokenName ||
            AUTH_OPTIONS_DEFAULTS.storageTokenName) as string;
    }

    saveToken(token: string): void {
        return localStorage.setItem(this._storageTokenName, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this._storageTokenName);
    }

    remove(): void {
        localStorage.removeItem(this._storageTokenName);
    }
}
