import { TestBed } from '@angular/core/testing';
import { JwtModule } from '@auth0/angular-jwt';

import { AUTH_SERVICE, AuthModule, AuthService, AuthTokenService } from '../../src';
import { CustomUser } from '../models/CustomUser';


describe('Service: AuthService : anonymous', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                JwtModule.forRoot({
                    config: {
                        tokenGetter: () => {
                            const authTokenService: AuthTokenService = TestBed.inject(AuthTokenService);
                            return authTokenService.getToken();
                        }
                    }
                }),
                AuthModule.forRoot({userType: CustomUser})
            ],
            providers: []
        });
    });

    it('should init anonymous', () => {
        const service: AuthService<CustomUser> = TestBed.inject(AUTH_SERVICE);
        expect(service.isAuthenticated()).toBeFalsy();
    });

    it('should not throw exception when token in storage is invalid', () => {
        const authTokenService: AuthTokenService = TestBed.inject(AuthTokenService);
        authTokenService.saveToken('invalid_token');
        const service: AuthService<CustomUser> = TestBed.inject(AUTH_SERVICE);
        expect(service).toBeTruthy();
        expect(service.isAuthenticated()).toBeFalsy();
        authTokenService.remove();
    });
});
