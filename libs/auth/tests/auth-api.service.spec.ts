import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';

import * as AuthTokens from '../src/auth/auth.tokens';
import { AuthOptions, User } from '../src/auth/models';
import { AuthApiService } from '../src/auth/services/auth-api.service';

describe('AuthApiService', () => {
    let injector: TestBed;
    let service: AuthApiService;
    let httpMock: HttpTestingController;
    const OPTIONS: AuthOptions<User> = {
        tokenEndpoint: '/identity/connect/token',
        stsParams: {
            scope: 'scope',
            client_id: 'id',
            client_secret: 'secret'
        }
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                AuthApiService,
                {provide: AuthTokens.AUTH_OPTIONS, useValue: OPTIONS}
            ]
        });
        injector = getTestBed();
        service = injector.inject(AuthApiService);
        httpMock = injector.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should create the service', () => {
        expect(service).toBeTruthy();
    });

    it('should be login', () => {
        const dummyData = 'data';
        service.login('login', 'pass')
            .subscribe(data => expect(data).toBe(dummyData));
        const req = httpMock.expectOne(OPTIONS.tokenEndpoint);
        expect(req.request.method).toBe('POST');
        req.flush(dummyData);
    });

    it('should be refresh', () => {
        const dummyData = 'data';
        service.refresh('new_token')
            .subscribe(data => expect(data).toBe(dummyData));
        const req = httpMock.expectOne(OPTIONS.tokenEndpoint);
        expect(req.request.method).toBe('POST');
        req.flush(dummyData);
    });

});
