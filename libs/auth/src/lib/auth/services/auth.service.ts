import {Inject, Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {BehaviorSubject, Observable, distinctUntilChanged, interval} from 'rxjs';
import {catchError, map, share, tap} from 'rxjs/operators';

import {PERMISSION_FULL_ACCESS} from '../../auth.constants';
import {AUTH_API_SERVICE, AUTH_OPTIONS, AUTH_TOKEN_SERVICE} from '../auth.tokens';
import {AuthOptions, IAuthApiService, IAuthTokenServiceInterface, User} from '../models';
import {AUTH_OPTIONS_DEFAULTS} from '../options-defaults.constants';

@Injectable({
    providedIn: 'root',
})
export class AuthService<T extends User> {
    private readonly authTokenService: IAuthTokenServiceInterface;
    private readonly opts: AuthOptions<T>;
    private readonly nulloUser: T;
    private _user: T;

    private readonly _user$: BehaviorSubject<T>;

    private _isAuthenticated$: Observable<boolean>;

    get user$() {
        return this._user$.asObservable().pipe(share());
    }

    get isAuthenticated$() {
        return this._isAuthenticated$;
    }

    constructor(
        @Inject(AUTH_API_SERVICE) private readonly authApi: IAuthApiService,
        @Inject(AUTH_TOKEN_SERVICE)
        authTokenService: IAuthTokenServiceInterface,
        private readonly jwtHelperService: JwtHelperService,
        @Inject(AUTH_OPTIONS) options: AuthOptions<T>,
    ) {
        this.authTokenService = authTokenService;
        this.opts = options ?? {
            userType: AUTH_OPTIONS_DEFAULTS.userType as new () => T, // FIXME: defaults
        };
        this.opts.userType = this.opts.userType ?? (AUTH_OPTIONS_DEFAULTS.userType as new () => T);
        this.opts.tokenName = this.opts.tokenName ?? AUTH_OPTIONS_DEFAULTS.tokenName;
        this.opts.superPermission =
            this.opts.superPermission ?? AUTH_OPTIONS_DEFAULTS.superPermission;

        this.nulloUser = new this.opts.userType();
        this._user$ = new BehaviorSubject<T>(this.nulloUser);
        this._user$
            .pipe(
                map(u => {
                    this._user = u;
                }),
            )
            .subscribe();

        this._isAuthenticated$ = this._user$.pipe(
            map(u => !this.isNulloUser(u)),
            distinctUntilChanged(),
            share(),
        );
        this.init().then(() => {
            this.tokenPooling();
        });
    }

    private tokenPooling() {
        interval(1000)
            .pipe(
                tap(async () => {
                    await this.updateUser();
                }),
            )
            .subscribe();
    }

    async login(login: string, password: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.authApi
                .login(login, password)
                .pipe(
                    map(token => {
                        if (!token) {
                            return;
                        }
                        const tokenValue =
                            token[this.opts.tokenName ?? AUTH_OPTIONS_DEFAULTS.tokenName!];
                        const expires = token.expires_in ? token.expires_in * 1000 : null;
                        if (typeof tokenValue === 'string') {
                            this.authTokenService.saveToken(tokenValue, expires);
                        }
                    }),
                    map(async () => {
                        resolve(await this.updateUser());
                    }),
                    catchError(e => {
                        reject(e);
                        return e;
                    }),
                )
                .subscribe();
        });
    }

    async logout(): Promise<T> {
        this.authTokenService.remove();
        return await this.updateUser();
    }

    authorize(requiredPermissions: string | string[] | null = null) {
        const currentUser = this._user;

        if (!currentUser.permissions) {
            return false;
        }

        if (!requiredPermissions) {
            return false;
        }

        const userPermissions = [...currentUser.permissions];
        if (userPermissions.includes(this.opts.superPermission ?? PERMISSION_FULL_ACCESS)) {
            return true;
        }

        return [...requiredPermissions].some(rp => userPermissions.includes(rp));
    }

    async getUser(): Promise<T> {
        if (!(await this.tokenIsValid())) {
            return this.nulloUser;
        }
        try {
            const decoded = this.jwtHelperService.decodeToken();
            return Object.freeze(
                Object.assign(this.opts.userType ? new this.opts.userType() : new User(), decoded),
            );
        } catch (e) {
            console.warn(e);
            return this.nulloUser;
        }
    }

    private async init() {
        await this.updateUser();
    }

    private async tokenIsValid() {
        const token = await this.jwtHelperService.tokenGetter();

        if (!token) {
            return false;
        }

        try {
            const tokenExpired = this.jwtHelperService.isTokenExpired(token);
            return !tokenExpired;
        } catch (e) {
            console.warn(e);
            return false;
        }
    }

    private async updateUser() {
        const currentUser = await this.getUser();
        this._user$.next(currentUser);
        return currentUser;
    }

    private isNulloUser(currentUser: T) {
        return (
            currentUser &&
            currentUser.sub !== undefined &&
            currentUser.sub !== '' &&
            currentUser.sub !== null
        );
    }
}
