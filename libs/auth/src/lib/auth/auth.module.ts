import {HttpClientModule} from '@angular/common/http';
import {ClassProvider, ModuleWithProviders, NgModule, Optional, Type} from '@angular/core';
import {JwtModule} from '@auth0/angular-jwt';
import * as AuthTokens from './auth.tokens';
import {AUTHORIZE_PROMPT_SETTINGS, AUTH_TOKEN_SERVICE} from './auth.tokens';
import {AuthorizeControlDirective} from './directives/authorize-control.directive';
import {AuthorizePromptDirective} from './directives/authorize-prompt.directive';
import {AuthorizeDirective} from './directives/authorize.directive';
import {AuthOptions, AuthorizePromptOptions, IAuthTokenServiceInterface, User} from './models';
import {AUTH_OPTIONS_DEFAULTS, PROMPT_OPTIONS_DEFAULTS} from './options-defaults.constants';
import {AuthApiService} from './services/auth-api.service';
import {AuthTokenService} from './services/auth-token.service';
import {AuthService} from './services/auth.service';
import {CookieAuthTokenService} from './services/cookie-auth-token.service';

export interface AuthTokenServiceClassProvider extends ClassProvider {
    useClass: Type<IAuthTokenServiceInterface>;
}

const DIRECTIVES = [AuthorizeDirective, AuthorizeControlDirective, AuthorizePromptDirective];

@NgModule({
    imports: [HttpClientModule],
    declarations: [DIRECTIVES],
    exports: [DIRECTIVES],
})
export class AuthModule {
    constructor(@Optional() jwtModule: JwtModule) {
        if (!jwtModule) {
            throw new Error('JwtModule required to be loaded.');
        }
    }

    static forRoot<T extends User>(
        options: AuthOptions<T>,
        service?: typeof AuthService,
        authTokenServiceProcvider?: AuthTokenServiceClassProvider,
        prompt?: AuthorizePromptOptions,
    ): ModuleWithProviders<AuthModule> {
        return {
            ngModule: AuthModule,
            providers: [
                AuthTokenService,
                AuthApiService,
                CookieAuthTokenService,
                {
                    provide: AuthTokens.AUTH_SERVICE,
                    useClass: service || AuthService,
                },
                {
                    provide: AuthTokens.AUTH_OPTIONS,
                    useValue: options || AUTH_OPTIONS_DEFAULTS,
                },
                authTokenServiceProcvider || {
                    provide: AUTH_TOKEN_SERVICE,
                    useClass: AuthTokenService,
                },
                {
                    provide: AUTHORIZE_PROMPT_SETTINGS,
                    useValue: prompt || PROMPT_OPTIONS_DEFAULTS,
                },
            ],
        };
    }
}
