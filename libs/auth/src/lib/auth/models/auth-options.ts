import { OAuthParams } from './oauth-params';

export interface AuthOptions<T> {
    userType?: new() => T;
    tokenName?: string;
    tokenEndpoint?: string;
    stsParams?: OAuthParams;
    storageTokenName?: string;
}
