import { TestBed } from '@angular/core/testing';

import { AuthTokenService, AUTH_OPTIONS_DEFAULTS } from '../src';
import * as AuthTokens from '../src/auth/auth.tokens';

describe('AuthTokenService', () => {
    let service: AuthTokenService;
    const TOKEN_KEY = AUTH_OPTIONS_DEFAULTS.storageTokenName;
    const TOKEN = 'token';
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthTokenService,
                {provide: AuthTokens.AUTH_OPTIONS, useValue: {tokenName: 'access_token'}}
            ]
        });
        service = TestBed.inject(AuthTokenService);
        let store = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            }
        };
        spyOn(localStorage, 'getItem')
            .and.callFake(mockLocalStorage.getItem);
        spyOn(localStorage, 'setItem')
            .and.callFake(mockLocalStorage.setItem);
        spyOn(localStorage, 'removeItem')
            .and.callFake(mockLocalStorage.removeItem);
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });


    it('should save the token in localStorage',
        () => {
            service.saveToken(TOKEN);
            expect(localStorage.getItem(TOKEN_KEY)).toBe(TOKEN);
        });

    it('should get stored token from localStorage',
        () => {
            localStorage.setItem(TOKEN_KEY, TOKEN);
            expect(service.getToken()).toBe(TOKEN);
        });

    it('should remove token from localStorage',
        () => {
            localStorage.setItem(TOKEN_KEY, TOKEN);
            service.remove();
            expect(localStorage.getItem(TOKEN_KEY)).toBe(null);
        });

});
