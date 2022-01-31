import {TestBed} from '@angular/core/testing';
import * as AuthTokens from '../src';
import {AuthTokenService, AUTH_OPTIONS_DEFAULTS} from '../src';

describe('AuthTokenService', () => {
    let service: AuthTokenService;
    const TOKEN_KEY = AUTH_OPTIONS_DEFAULTS.storageTokenName as string;
    const TOKEN = 'token';
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthTokenService,
                {
                    provide: AuthTokens.AUTH_OPTIONS,
                    useValue: {tokenName: 'access_token'},
                },
            ],
        });
        service = TestBed.inject(AuthTokenService);
        const store: {[key: string]: any} = {};
        const mockLocalStorage = {
            getItem: (key: string): string => {
                return key in store ? store[key] : null;
            },
            setItem: (key: string, value: string) => {
                store[key] = `${value}`;
            },
            removeItem: (key: string) => {
                delete store[key];
            },
        };

        global.localStorage = <any>mockLocalStorage;
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('should save the token in localStorage', () => {
        service.saveToken(TOKEN);
        expect(localStorage.getItem(TOKEN_KEY)).toBe(TOKEN);
    });

    it('should get stored token from localStorage', () => {
        localStorage.setItem(TOKEN_KEY, TOKEN);
        expect(service.getToken()).toBe(TOKEN);
    });

    it('should remove token from localStorage', () => {
        localStorage.setItem(TOKEN_KEY, TOKEN);
        service.remove();
        expect(localStorage.getItem(TOKEN_KEY)).toBe(null);
    });
});
