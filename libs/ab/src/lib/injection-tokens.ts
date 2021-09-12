import {InjectionToken} from '@angular/core';
import {ABOptions} from './interfaces';

export const CONFIG = new InjectionToken<ABOptions[]>('AB_CONFIG');
