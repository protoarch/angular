import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';

import { ApiModule, Api, nullSerializerFactory } from '../index';


describe('Service: Api', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                ApiModule.forRoot({
                    endpoint: '/api/'
                })
            ],
            providers: []
        });
    });

    it('should be provided', () => {
        const service: Api = TestBed.get(Api);
        expect(service).toBeTruthy();
    });

    it('should provide correct endpoint', () => {
        const service: Api = TestBed.get(Api);
        expect(service.buildUrl('http://ya.ru')).toEqual('http://ya.ru');
        expect(service.buildUrl('https://ya.ru')).toEqual('https://ya.ru');
        expect(service.buildUrl('test')).toEqual('/api/test');
    });

    it('should build correct query string',
        async(
            inject([Api, HttpTestingController], (apiService: Api, backend: HttpTestingController) => {
                const path = 'test';
                const expectedPath = '/api/test';

                apiService.get(path, { params: { array: [1, 2], object: { a: 1, b: 2} } }).subscribe();
                backend.expectOne({
                    url: expectedPath + '?array=1&array=2&object[a]=1&object[b]=2',
                    method: 'GET'
                });

                apiService.post(path, null, { params: { array: [1, 2], object: { a: 1, b: 2} } }).subscribe();
                backend.expectOne({
                    url: expectedPath + '?array=1&array=2&object[a]=1&object[b]=2',
                    method: 'POST'
                });

                apiService.put(path, null, { params: { array: [1, 2], object: { a: 1, b: 2} } }).subscribe();
                backend.expectOne({
                    url: expectedPath + '?array=1&array=2&object[a]=1&object[b]=2',
                    method: 'PUT'
                });

                apiService.delete(path, { params: { array: [1, 2], object: { a: 1, b: 2} } }).subscribe();
                backend.expectOne({
                    url: expectedPath + '?array=1&array=2&object[a]=1&object[b]=2',
                    method: 'DELETE'
                });
            })
        )
    );

    it('should POST/PUT body',
        async(
            inject([Api, HttpTestingController], (apiService: Api, backend: HttpTestingController) => {
                const path = 'test';
                const expectedPath = '/api/test';
                const testData = {
                    a: 1,
                    b: 2
                };

                apiService.post(path, testData).subscribe();
                const postReq = backend.expectOne({
                    url: expectedPath,
                    method: 'POST'
                });
                expect(JSON.stringify(postReq.request.body)).toEqual(JSON.stringify(testData));

                apiService.put(path, testData).subscribe();
                const putReq = backend.expectOne({
                    url: expectedPath,
                    method: 'PUT'
                });
                expect(JSON.stringify(putReq.request.body)).toEqual(JSON.stringify(testData));
            })
        )
    );

    it('should observe response',
        async(
            inject([Api, HttpTestingController], (apiService: Api, backend: HttpTestingController) => {
                const path = 'test';
                const expectedPath = '/api/test';
                const testData = {
                    a: 1,
                    b: 2
                };

                apiService.post(path, testData, { observe: 'response' }).subscribe((resp: any) => {
                    expect(resp.status).toEqual(200);
                    expect(JSON.stringify(resp.body)).toEqual(JSON.stringify(testData));
                });
                backend.expectOne({
                    url: expectedPath,
                    method: 'POST',
                }).flush(testData);
            })
        )
    );

    it('nullo-mapper should pass through values', () => {
        const nulloMapper = nullSerializerFactory();
        const testData = {
            a: 1
        };
        expect(nulloMapper.serialize(testData)).toEqual(testData);
        expect(nulloMapper.deserialize(testData)).toEqual(testData);
    });

});
