import {Inject, Injectable} from '@angular/core';
import {TestBed} from '@angular/core/testing';
import {JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import {
    AuthApiService,
    AuthModule,
    AuthOptions,
    AuthService,
    AuthTokenService,
    User,
} from '../../src';
import * as AuthTokens from '../../src/lib/auth/auth.tokens';
import {generateToken} from '../utils/jwt';

@Injectable()
class CustomAuthService<T extends User> extends AuthService<T> {
    private _logoutStatus = false;

    constructor(
        authApi: AuthApiService,
        authTokenService: AuthTokenService,
        jwtHelperService: JwtHelperService,
        @Inject(AuthTokens.AUTH_OPTIONS) options: AuthOptions<T>,
    ) {
        super(authApi, authTokenService, jwtHelperService, options);
    }

    get getLogoutStatus(): boolean {
        return this._logoutStatus;
    }

    logout() {
        const logoutResult = super.logout();
        this._logoutStatus = true;
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
                        },
                    },
                }),
                AuthModule.forRoot({userType: User}, CustomAuthService),
            ],
        });
    });

    it('should init', () => {
        const service: CustomAuthService<User> = TestBed.inject<CustomAuthService<User>>(
            AuthTokens.AUTH_SERVICE,
        );
        expect(service).toBeTruthy();
        service.isAuthenticated$.subscribe(isAuth => {
            expect(isAuth).toBeTruthy();
        });
    });

    it('should init nulloUser right', () => {
        const service: CustomAuthService<User> = TestBed.inject<CustomAuthService<User>>(
            AuthTokens.AUTH_SERVICE,
        );
        service.user$.subscribe(cu => {
            expect(cu.sub).toEqual(undefined);
            expect(cu.preferred_username).toEqual(undefined);
        });
    });

    it('should fill user props', () => {
        const service: CustomAuthService<User> = TestBed.inject<CustomAuthService<User>>(
            AuthTokens.AUTH_SERVICE,
        );
        service.user$.subscribe(cu => {
            expect(cu.preferred_username).toEqual('79119111113');
        });
    });

    it('should has own props/methods', () => {
        const service: CustomAuthService<User> = TestBed.inject<CustomAuthService<User>>(
            AuthTokens.AUTH_SERVICE,
        );
        expect(service.getLogoutStatus).toBeDefined();
        expect(service.getLogoutStatus).toBeFalsy();
        service.logout();
        expect(service.getLogoutStatus).toBeTruthy();
    });
});
