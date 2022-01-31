import {HttpParameterCodec, HttpParams, HttpParamsOptions} from '@angular/common/http';

export class ApiQueryStringBuilder {
    constructor(private encoder: HttpParameterCodec) {}

    public build(key: string | number, value: any): string {
        return value instanceof Object
            ? this.buildStringFromObject(key, value)
            : this.buildStringFromPrimitive(key, value);
    }

    private buildStringFromObject(key: string | number, object: {[key: string]: any}): string {
        const keys = Object.keys(object);
        const result = [];

        for (const childK in keys) {
            if (childK) {
                const childKey = keys[childK];

                const buildedKey = this.buildKey(object, key, childKey);
                const objectChildKey = this.build(buildedKey, object[childKey]);

                if (objectChildKey !== '') {
                    result.push(objectChildKey);
                }
            }
        }
        return result.join('&');
    }

    private buildKey(value: {[key: string]: any}, key: string | number, childKey: string | number) {
        if (
            (value instanceof Array && value[childKey as number] instanceof Object) ||
            (value instanceof Array && !(value[childKey as number] instanceof Object))
        ) {
            return key;
        }

        if (value instanceof Object) {
            return `${key}[${this.encoder.encodeKey(childKey as string)}]`;
        }

        return childKey;
    }

    private buildStringFromPrimitive(key: string | number, value: any): string {
        return value === undefined ? key.toString() : `${key}=${this.encoder.encodeValue(value)}`;
    }
}

export const getWebApiHttpParams = (options?: HttpParamsOptions) => {
    return new Proxy(new HttpParams(options), {
        get(target, property) {
            const t: any = target;
            if (property === 'toString') {
                t.init();
                const queryStringBuilder = new ApiQueryStringBuilder(t.encoder);
                return () =>
                    t
                        .keys()
                        .map((key: string) => {
                            const eKey = t.encoder.encodeKey(key);
                            const mapValue = t.map.get(key);
                            return queryStringBuilder.build(eKey, mapValue);
                        })
                        .join('&');
            }
            return t[property];
        },
    });
};
