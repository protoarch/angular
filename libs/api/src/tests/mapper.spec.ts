import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';

import { API_SERIALIZER, ApiModule, Api } from '../index';
import { ToUpperCaseSerializer } from './mocks/to-upper-case-serializer';


describe('SimplyApiService: serializer (mapper)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                ApiModule.forRoot({
                    serializeProvider: {
                        provide: API_SERIALIZER,
                        useFactory: () => new ToUpperCaseSerializer()
                    }
                })
            ],
            providers: []
        });
    });

    it('should call deserialize method',
        async(
            inject([Api, HttpTestingController], (apiService: Api, backend: HttpTestingController) => {
                const path = '/api/test';

                class Test {
                    UPPERCASED: string;
                }

                apiService.get(path, { deserializeTo: Test }).subscribe((deserialized: Test) => {
                    expect(deserialized instanceof Test).toBeTruthy();
                    expect(deserialized.UPPERCASED).toBeTruthy();
                    expect(deserialized.UPPERCASED).toEqual('text');
                });
                backend.expectOne({
                    url: path,
                    method: 'GET'
                }).flush({ uppercased: 'text' });
            })
        )
    );

    it('should deserializeTo arrays',
        async(
            inject([Api, HttpTestingController], (apiService: Api, backend: HttpTestingController) => {
                const path = '/api/test';

                class Test {
                    UPPERCASED: string;
                }

                apiService.get(path, { deserializeTo: [Test] }).subscribe((deserialized: Test[]) => {
                    expect(deserialized instanceof Array).toBeTruthy();
                    expect(deserialized[0] instanceof Test).toBeTruthy();
                    expect(deserialized[1] instanceof Test).toBeTruthy();
                    expect(deserialized[0].UPPERCASED).toBeTruthy();
                    expect(deserialized[0].UPPERCASED).toEqual('text');
                    expect(deserialized[1].UPPERCASED).toBeTruthy();
                    expect(deserialized[1].UPPERCASED).toEqual('text_two');
                });
                backend.expectOne({
                    url: path,
                    method: 'GET'
                }).flush(
                    [
                        { uppercased: 'text' },
                        { uppercased: 'text_two' }
                    ]
                );
            })
        )
    );


    it('should call serialize method on POST and GET',
        async(
            inject([Api, HttpTestingController], (apiService: Api, backend: HttpTestingController) => {
                const path = '/api/test';
                const originalText = 'should_be_uppercased';
                const expectedText = originalText.toUpperCase();

                class Test {
                    toString() {
                        return originalText;
                    }
                }

                apiService.get(path, { params: new Test() }).subscribe();
                backend.expectOne({
                    url: path + '?' + expectedText,
                    method: 'GET'
                });


                apiService.post(path, new Test()).subscribe();
                const postReq = backend.expectOne({
                    url: path,
                    method: 'POST'
                });
                expect(postReq.request.body).toEqual(expectedText);
                postReq.flush({});

            })
        )
    );

});
