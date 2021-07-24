import { ISerializer } from '../../index';

export class ToUpperCaseSerializer implements ISerializer {
    serialize(data: any) {
        return data && data.toString().toUpperCase();
    }
    deserialize(data: any, T?: new (...args) => any) {
        const newData = {};
        if (data instanceof Object) {
            Object.keys(data).forEach(key => {
                newData[key.toString().toUpperCase()] = data[key];
            });
        }
        return Object.assign(new T(), newData);
    }
}
