import { WebApiHttpParams } from '../lib/web-api-http-params';


describe('Query string encoder', () => {

    it('should serialize simple object to query string', () => {

        const obj: any = {
            numeric: 1,
            float: 1.40,
            string: 'text'
        };
        const params = new WebApiHttpParams({ fromObject: obj });
        expect(params.toString()).toEqual('numeric=1&float=1.4&string=text');
    });

    it('should serialize array to query string', () => {
        const params = new WebApiHttpParams({ fromObject:  <any>[1, 2, 3] });
        expect(params.toString()).toEqual('0=1&1=2&2=3');
    });

    it('should serialize complex object to query string', () => {
        const complexObj: any = {
            numeric: 1,
            float: 1.40,
            string: 'text',
            subObject: {
                prop1: 'a',
                prop2: 'b'
            },
            arrayPrimitive: [1],
            arrayObjects: [
                {
                    value: 1
                },
                {
                    value: 2
                }
            ]
        };

        const params = new WebApiHttpParams({ fromObject: complexObj });
        expect(params.toString()).toEqual('numeric=1&float=1.4&string=text&subObject[prop1]=a&subObject[prop2]=b&arrayPrimitive=1&arrayObjects[value]=1&arrayObjects[value]=2');
    });

});
