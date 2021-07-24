/**
 * Default OAuth 2.0 claims
 *
 * https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * interface TokenClaims
 */
export interface TokenClaims {
    iss: string;
    aud: string;
    exp: number;
    nbf: number;
    client_id: string;
    scope: string | string[];
    sub: string;
    auth_time: number;
    idp: string;
    amr: string[];
}

/**
 * Стандартные клаймы openid (UserInfo)
 * 
 * https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 *
 * interface UserInfoClaims
 */
export interface UserInfoClaims {
    sub: string;
    preferred_username?: string;
    email?: string;
    email_verified?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    father_name?: string;
}

/**
 * Прочие клаймы системы
 *
 * interface NonStandardClaims
 */
export interface NonStandardClaims {
    /**
     * **Client id**
     * type {string}
     * memberof UserInfoClaims
     */
    user_client_id?: string;
    claims?: string | string[];
    role?: string;
}

export class User implements TokenClaims, UserInfoClaims, NonStandardClaims {

    iss: string;
    aud: string;
    exp: number;
    nbf: number;
    // tslint:disable-next-line:variable-name
    client_id: string;
    scope: string | string[];
    sub: string;
    // tslint:disable-next-line:variable-name
    auth_time: number;
    idp: string;
    amr: string[];

    // tslint:disable-next-line:variable-name
    preferred_username?: string;
    email?: string;
    // tslint:disable-next-line:variable-name
    email_verified?: string;
    name?: string;
    // tslint:disable-next-line:variable-name
    given_name?: string;
    // tslint:disable-next-line:variable-name
    family_name?: string;
    // tslint:disable-next-line:variable-name
    father_name?: string;

    // tslint:disable-next-line:variable-name
    user_client_id?: string;
    claims?: string | string[];
    role?: string;
}

