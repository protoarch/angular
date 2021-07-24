import { Inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { JwtHelperService, JwtModule } from '@auth0/angular-jwt';

import {
    AUTH_OPTIONS,
    AUTH_SERVICE,
    AuthApiService,
    AuthModule,
    AuthOptions,
    AuthService,
    AuthTokenService,
} from '../../src';
import { User } from '../../src/auth/models';
import { generateToken } from '../utils/jwt';

class CustomAuthService<T extends User> extends AuthService<T> {

    private logoutStatus = false;

    constructor(
        authApi: AuthApiService,
        authTokenService: AuthTokenService,
        jwtHelperService: JwtHelperService,
        @Inject(AUTH_OPTIONS) options: AuthOptions<T>
    ) {
        super(authApi, authTokenService, jwtHelperService, options);
    }

    get getLogoutStatus(): boolean {
        return this.logoutStatus;
    }

    logout() {
        const logoutResult = super.logout();
        this.logoutStatus = true;
        return logoutResult;
    }
}

describe('Service: custom AuthService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                JwtModule.forRoot({
                    config: {
                        tokenGetter: () => {
                            return generateToken().access_token;
                        }
                    }
                }),
                AuthModule.forRoot({userType: User}, CustomAuthService)
            ]
        });
    });

    it('should init', () => {
        const service: CustomAuthService<User> = TestBed.inject<any>(AUTH_SERVICE);
        expect(service).toBeTruthy();
        expect(service.isAuthenticated()).toBeTruthy();
    });

    it('should init nulloUser right', () => {
        const service: CustomAuthService<User> = TestBed.inject<any>(AUTH_SERVICE);
        expect(service.nulloUser.preferred_username).toEqual(undefined);
        expect(service.nulloUser.user_client_id).toEqual(undefined);
        expect(service.nulloUser.scope).toEqual(undefined);
    });

    it('should fill user props', () => {
        const service: CustomAuthService<User> = TestBed.inject<any>(AUTH_SERVICE);
        service.user$.subscribe(cu => {
            expect(cu.preferred_username).toEqual('79119111113');
            expect(cu.user_client_id).toEqual('43');
            expect(cu.scope).toEqual('ClientApiScope');
        });
    });

    it('should has own props/methods', () => {
        const service: CustomAuthService<User> = TestBed.inject<any>(AUTH_SERVICE);
        expect(service.getLogoutStatus).toBeDefined();
        expect(service.getLogoutStatus).toBeFalsy();
        service.logout();
        expect(service.getLogoutStatus).toBeTruthy();
    });
});
