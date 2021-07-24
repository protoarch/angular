import { HttpParams } from '@angular/common/http';

export class WebApiHttpParams extends HttpParams {

    private parent;

    constructor(options?) {
        const parent = super(options);
        this.parent = parent;
        if (!!options.fromObject) {
            this.parent.map = new Map();
            if (typeof options.fromObject === 'string' || typeof options.fromObject === 'number') {
                this.parent.map.set(options.fromObject);
            } else {
                Object.keys(options.fromObject).forEach((key) => {
                    this.parent.map.set(key, options.fromObject[key]);
                });
            }
        }
    }

    append(param, value): HttpParams {
        throw new Error('Method not impemented');
    }
    delete(param, value): HttpParams {
        throw new Error('Method not impemented');
    }
    set(param, value): HttpParams {
        throw new Error('Method not impemented');
    }

    toString() {
        this.parent.init();
        return this.keys()
            .map((key) => {
                const eKey = this.parent.encoder.encodeKey(key);
                const mapValue = this.parent.map.get(key);
                return this.buildString(eKey, mapValue);
            }).join('&');
    }

    private buildString(key, value) {
        return value instanceof Object ?
            this.buildStringFromObject(key, value)
            :
            this.buildStringFromPrimitive(key, value);
    }

    private buildStringFromObject(key, object) {
        const keys = Object.keys(object);
        let result = [];

        for (let childK in keys) {
            if (childK) {
                const childKey = keys[childK];

                const buildedKey = this.buildKey(object, key, childKey);
                const objectChildKey = this.buildString(buildedKey, object[childKey]);

                if (objectChildKey !== '') {
                    result.push(objectChildKey);
                }
            }
        }
        return result.join('&');
    }

    private buildKey(value, key, childKey) {
        if (value instanceof Array && value[childKey] instanceof Object || value instanceof Array && !(value[childKey] instanceof Object)) {
            return key;
        }

        if (value instanceof Object) {
            return `${key}[${this.parent.encoder.encodeKey(childKey)}]`;
        }

        return childKey;
    }

    private buildStringFromPrimitive(key, value) {
        return value === undefined ? key : `${key}=${this.parent.encoder.encodeValue(value)}`;
    }
}
