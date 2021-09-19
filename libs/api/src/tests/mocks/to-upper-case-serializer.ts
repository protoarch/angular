import { ISerializer } from '../../index';

export class ToUpperCaseSerializer implements ISerializer {
  serialize(data: any) {
    return data?.toString().toUpperCase();
  }
  deserialize(data: any, T?: new (...args: any[]) => any) {
    const newData: { [key: string]: any } = {};
    if (data instanceof Object) {
      Object.keys(data).forEach((key) => {
        newData[key.toString().toUpperCase()] = data[key];
      });
    }
    return Object.assign(T ? new T() : {}, newData);
  }
}
