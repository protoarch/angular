import {flattenParamsObject} from '../lib/web-api-http-params';

describe('Query params flatten', () => {
    it('should flatten simple object', () => {
        const obj: any = {
            numeric: 1,
            float: 1.4,
            string: 'text',
        };

        expect(JSON.stringify(flattenParamsObject(obj))).toEqual(
            JSON.stringify({
                numeric: 1,
                float: 1.4,
                string: 'text',
            }),
        );
    });

    it('should flatten array', () => {
        const params = flattenParamsObject(<any>[1, 2, 3]);
        expect(JSON.stringify(params)).toEqual(
            JSON.stringify({
                '0': 1,
                '1': 2,
                '2': 3,
            }),
        );
    });

    it('should flatten complex object', () => {
        const complexObj: any = {
            numeric: 1,
            float: 1.4,
            string: 'text',
            subObject: {
                prop1: 'a',
                prop2: 'b',
            },
            arrayPrimitive: [1],
            arrayObjects: [
                {
                    value: 1,
                },
                {
                    value: 2,
                },
            ],
        };

        const params = flattenParamsObject(complexObj);
        expect(JSON.stringify(params)).toEqual(
            JSON.stringify({
                numeric: 1,
                float: 1.4,
                string: 'text',
                'subObject[prop1]': 'a',
                'subObject[prop2]': 'b',
                'arrayPrimitive[0]': 1,
                'arrayObjects[0][value]': 1,
                'arrayObjects[1][value]': 2,
            }),
        );
    });
});
