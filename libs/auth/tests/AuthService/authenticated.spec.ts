import {TestBed} from '@angular/core/testing';
import {JwtModule} from '@auth0/angular-jwt';
import {AUTH_SERVICE, AuthModule, AuthService} from '../../src';
import {CustomUser} from '../models/CustomUser';
import {generateToken} from '../utils/jwt';

describe('Service: AuthService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                JwtModule.forRoot({
                    config: {
                        tokenGetter: () => {
                            // tslint:disable-next-line:max-line-length
                            return generateToken().access_token;
                        },
                    },
                }),
                AuthModule.forRoot({userType: CustomUser}),
            ],
            providers: [],
        });
    });

    it('should init', () => {
        const service: AuthService<CustomUser> = TestBed.inject(AUTH_SERVICE);
        expect(service).toBeTruthy();
        service.user$.subscribe(cu => {
            expect(cu instanceof CustomUser).toBeTruthy();
        });

        service.isAuthenticated$.subscribe(isAuth => {
            expect(isAuth).toBeTruthy();
        });
    });

    it('should init nulloUser right', () => {
        const service: AuthService<CustomUser> = TestBed.inject(AUTH_SERVICE);
        const nulloUser = new CustomUser();
        service.user$.subscribe(cu => {
            expect(cu.preferred_username).toEqual(undefined);
            expect(cu.preferred_username).toEqual(nulloUser.preferred_username);
        });
    });

    it('should fill user props', () => {
        const service: AuthService<CustomUser> = TestBed.inject(AUTH_SERVICE);
        service.user$.subscribe(cu => {
            expect(cu.preferred_username).toEqual('79119111113');
            expect(cu.custom_claim).toEqual('custom_claim');
        });
    });
});
