import { InjectionToken } from '@angular/core';

import { AuthOptions, AuthorizePromptOptions, User } from './models';
import { IAuthTokenServiceInterface } from './models/auth-token-service.interface';
import { AuthService } from './services/auth.service';

export const AUTH_OPTIONS: InjectionToken<AuthOptions<User>> = new InjectionToken<AuthOptions<User>>('AUTH_OPTIONS');
export const AUTH_SERVICE: InjectionToken<AuthService<User>> = new InjectionToken<AuthService<User>>('AUTH_SERVICE');
export const AUTH_TOKEN_SERVICE: InjectionToken<AuthService<User>> = new InjectionToken<IAuthTokenServiceInterface>('AUTH_TOKEN_SERVICE');
export const AUTHORIZE_PROMPT_SETTINGS = new InjectionToken<AuthorizePromptOptions>('AUTHORIZE_PROMPT_SETTINGS');
