import {InjectionToken} from '@angular/core';
import {ISerializer} from './api.options';

export const API_ENDPOINT: InjectionToken<string> = new InjectionToken<string>('API_ENDPOINT');

export const API_SERIALIZER: InjectionToken<ISerializer> = new InjectionToken<ISerializer>(
    'API_SERIALIZER',
);
