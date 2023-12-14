import {OAuthParams} from './oauth-params';

export interface AuthOptions<T> {
    userType?: new () => T;
    tokenName?: string;
    tokenEndpoint?: string;
    oauthRequestParams?: OAuthParams;
    storageTokenName?: string;

    superPermission?: string;
}
