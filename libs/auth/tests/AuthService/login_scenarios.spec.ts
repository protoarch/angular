import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed, getTestBed} from '@angular/core/testing';
import {JWT_OPTIONS, JwtModule} from '@auth0/angular-jwt';
import {
    AUTH_OPTIONS_DEFAULTS,
    AUTH_SERVICE,
    AuthModule,
    AuthService,
    AuthTokenService,
    User,
} from '../../src';
import {generateToken} from '../utils/jwt';

export function jwtOptionsFactory(authTokenService: AuthTokenService) {
    return {
        tokenGetter: () => {
            return authTokenService.getToken();
        },
    };
}

describe('Service: AuthService login scenarios:', () => {
    let httpMock: HttpTestingController;
    let injector: TestBed;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                JwtModule.forRoot({
                    jwtOptionsProvider: {
                        provide: JWT_OPTIONS,
                        useFactory: jwtOptionsFactory,
                        deps: [AuthTokenService],
                    },
                }),
                AuthModule.forRoot({userType: User, tokenName: 'custom_token_name'}),
            ],
            providers: [],
        });
        injector = getTestBed();
        httpMock = injector.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        const tokenService: AuthTokenService = TestBed.inject(AuthTokenService);
        tokenService.remove();
    });

    it('should login', () => {
        const service: AuthService<User> = TestBed.inject(AUTH_SERVICE);
        const tokenService: AuthTokenService = TestBed.inject(AuthTokenService);
        expect(service).toBeTruthy();
        const token = generateToken();
        service.login('login', 'pass').then(() => {
            expect(tokenService.getToken()).toEqual(token.access_token);
            service.isAuthenticated$.subscribe(isAuth => {
                expect(isAuth).toBeFalsy();
            });
            httpMock.expectOne(AUTH_OPTIONS_DEFAULTS.tokenEndpoint as string).flush({
                custom_token_name: token.access_token,
            });
        });
    });

    it('should not login when token was not specified at response (or wrong token name specified)', () => {
        const service: AuthService<User> = TestBed.inject(AUTH_SERVICE);
        const tokenService: AuthTokenService = TestBed.inject(AuthTokenService);
        expect(service).toBeTruthy();
        service.login('login', 'pass').then(() => {
            expect(JSON.parse(<string>tokenService.getToken())).toBeFalsy();
            service.isAuthenticated$.subscribe(isAuth => {
                expect(isAuth).toBeFalsy();
            });
            httpMock.expectOne(AUTH_OPTIONS_DEFAULTS.tokenEndpoint as string).flush({});
        });
    });
});
