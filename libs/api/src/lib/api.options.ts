import { FactoryProvider } from '@angular/core';

export interface ISerializer {
    serialize(data: any): any;
    deserialize(data: any, T?: { new (): any; }): any;
}

export interface ISerializerProvider extends FactoryProvider {
    useFactory: () => ISerializer;
}

export interface IApiModuleOptions {
    endpoint?: string;
    serializeProvider?: ISerializerProvider;
}
