import {HttpClient, HttpContext, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable, Optional} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ISerializer} from './api.options';
import {API_ENDPOINT, API_SERIALIZER} from './api.tokens';
import {flattenParamsObject} from './web-api-http-params';

export enum ResponseTypeEnum {
    json = 'json',
    text = 'text',
    arraybuffer = 'arraybuffer',
    blob = 'blob',
}

export interface IApiOptions {
    headers?:
        | HttpHeaders
        | {
              [header: string]: string | string[];
          };
    context?: HttpContext;
    observe?: any | 'body';
    params?: any;
    reportProgress?: boolean;
    responseType?: any | ResponseTypeEnum;
    withCredentials?: boolean;
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
    deserializeTo?: {new (...args: any[]): any} | [{new (...args: any[]): any}];
}

@Injectable()
export class Api {
    constructor(
        private http: HttpClient,
        @Optional()
        @Inject(API_ENDPOINT)
        private apiEndpoint: string | null = null,
        @Optional()
        @Inject(API_SERIALIZER)
        private serializer: ISerializer,
    ) {}

    public get<T>(url: string, options?: IApiOptions & IDeserializeOptions): Observable<T> {
        const opts = this.buildOptions<T>(options);
        return this.http
            .get<T>(this.buildUrl(url), opts)
            .pipe(map(result => this.tryDeserialize<T>(result, opts?.deserializeTo)));
    }

    public post<T>(
        url: string,
        body: any,
        options?: IApiOptions & IDeserializeOptions,
    ): Observable<T> {
        const opts = this.buildOptions<T>(options);
        return this.http
            .post<T>(this.buildUrl(url), this.trySerialize(body), opts)
            .pipe(map(result => this.tryDeserialize<T>(result, opts?.deserializeTo)));
    }

    public put<T>(
        url: string,
        body: any,
        options?: IApiOptions & IDeserializeOptions,
    ): Observable<T> {
        const opts = this.buildOptions<T>(options);
        return this.http
            .put<T>(this.buildUrl(url), this.trySerialize(body), opts)
            .pipe(map(result => this.tryDeserialize<T>(result, opts?.deserializeTo)));
    }

    public delete<T>(url: string, options?: IApiOptions & IDeserializeOptions): Observable<T> {
        const opts = this.buildOptions<T>(options);
        return this.http
            .delete<T>(this.buildUrl(url), opts)
            .pipe(map(result => this.tryDeserialize<T>(result, opts?.deserializeTo)));
    }

    public buildUrl(url: string) {
        if ((url && url.startsWith('http')) || !this.apiEndpoint) {
            return url;
        }
        return this.apiEndpoint.concat(url);
    }

    private buildOptions<T>(options: (IApiOptions & IDeserializeOptions) | undefined) {
        const opts = {responseType: ResponseTypeEnum.json, ...options};
        opts.params = this.getHttpParams(opts?.params);
        return opts;
    }

    private getHttpParams(params: {[key: string]: any} | null = null): HttpParams | undefined {
        if (params === null || params === undefined) {
            return undefined;
        }
        const serializedParams = this.trySerialize(params);
        return typeof serializedParams === 'object'
            ? flattenParamsObject(serializedParams)
            : new HttpParams({fromString: serializedParams.toString()});
    }

    private trySerialize(data: any): any {
        if (this.serializer) {
            return this.serializer.serialize(data);
        }
        return data;
    }

    private tryDeserialize<T>(
        data: any,
        deserializeTo?: {new (...args: any[]): T} | [{new (...args: any[]): T}],
    ) {
        if (!deserializeTo || !this.serializer) {
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
