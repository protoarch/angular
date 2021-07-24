import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ISerializer } from './api.options';
import { API_ENDPOINT, API_SERIALIZER } from './api.tokens';
import { WebApiHttpParams } from './web-api-http-params';


export enum ResponseTypeEnum {
    json = 'json',
    text = 'text',
    arraybuffer = 'arraybuffer',
    blob = 'blob'
}

export interface IApiOptions  {
    headers?: HttpHeaders;
    params?: { [key: string]: any };
    responseType?: any;
    reportProgress?: boolean;
    withCredentials?: boolean;
    observe?;
}

export interface IDeserializeOptions {
    /**
     *  Accepts:
     *  - constructor: to deserialize to instance of object
     *  - [constructor] (array with a single element constructor): to deserialize to array of instances
     *
     * type {({ new(...args): any } | [{ new(...args): any }])}
     *
     * memberof IDeserializeOptions
     */
    deserializeTo?: { new(...args): any } | [{ new(...args): any }];
}

@Injectable()
export class Api {
    constructor(
        private http: HttpClient,
        @Optional()
        @Inject(API_ENDPOINT)
        private apiEndpoint: string = null,
        @Optional()
        @Inject(API_SERIALIZER)
        private serializer: ISerializer
    ) {}

    public get<T>(url: string, options?: IApiOptions & IDeserializeOptions): Observable<T> {
        options = options || { responseType: ResponseTypeEnum.json };
        options.params = this.getHttpParams(options.params);
        return this.http
            .get<T>(this.buildUrl(url), options)
            .pipe(map(result => this.tryDeserialize<T>(result, options && options.deserializeTo)));
    }

    public post<T>(url: string, body: any, options?: IApiOptions & IDeserializeOptions): Observable<T> {
        options = options || { responseType: ResponseTypeEnum.json };
        options.params = this.getHttpParams(options.params);
        return this.http
            .post<T>(this.buildUrl(url), this.trySerialize(body), options)
            .pipe(map(result => this.tryDeserialize<T>(result, options && options.deserializeTo)));
    }

    public put<T>(url: string, body: any, options?: IApiOptions & IDeserializeOptions): Observable<T> {
        options = options || { responseType: ResponseTypeEnum.json };
        options.params = this.getHttpParams(options.params);
        return this.http
            .put<T>(this.buildUrl(url), this.trySerialize(body), options)
            .pipe(map(result => this.tryDeserialize<T>(result, options && options.deserializeTo)));
    }

    public delete<T>(url: string, options?: IApiOptions & IDeserializeOptions): Observable<T> {
        options = options || { responseType: ResponseTypeEnum.json };
        options.params = this.getHttpParams(options.params);
        return this.http
            .delete<T>(this.buildUrl(url), options)
            .pipe(map(result => this.tryDeserialize<T>(result, options && options.deserializeTo)));
    }

    public buildUrl(url: string) {
        if ((url && url.startsWith('http')) || !this.apiEndpoint) {
            return url;
        }
        return this.apiEndpoint.concat(url);
    }

    private getHttpParams(params: { [key: string]: any }): HttpParams {
        if (params === null || params === undefined) {
            return null;
        }
        return new WebApiHttpParams({ fromObject: this.trySerialize(params) });
    }

    private trySerialize(data: any): any {
        if (this.serializer) {
            return this.serializer.serialize(data);
        }
        return data;
    }

    private tryDeserialize<T>(data: any, deserializeTo: { new(...args): T } | [{ new(...args): T }]) {
        if (!this.serializer) {
            return data;
        }
        if (deserializeTo instanceof Array && data instanceof Array) {
            const type = deserializeTo.length > 0 ? deserializeTo[0] : undefined;
            return data.map(d => this.serializer.deserialize(d, type));
        }
        if (typeof deserializeTo === 'function') {
            return this.serializer.deserialize(data, deserializeTo);
        }
        return data;
    }
}
