/**
 * Default OAuth 2.0 claims
 *
 * https://openid.net/specs/openid-connect-core-1_0.html#IDToken
 * interface TokenClaims
 */
export interface JwtToken {
    iss?: string;
    aud?: string;
    exp?: number;
    nbf?: number;
    sub?: string;
    auth_time?: number;
    idp?: string;
}

/**
 * Стандартные клаймы openid (UserInfo)
 *
 * https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
 *
 * interface StandardClaims
 */
export interface StandardClaims {
    sub?: string;
    preferred_username?: string;
    email?: string;
    email_verified?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    father_name?: string;
}

/**
 * Non Standard Claims
 *
 * interface NonStandardClaims
 */
export interface NonStandardClaims {
    claims?: string[];
    role?: string;
}

export class User implements StandardClaims, NonStandardClaims, JwtToken {
    iss?: string;
    aud?: string;
    exp?: number;
    nbf?: number;
    auth_time?: number;
    idp?: string;
    sub?: string;

    preferred_username?: string;
    email?: string;
    email_verified?: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    father_name?: string;

    permissions?: string[];
    role?: string;

    /**
     * @deprecated
     */
    claims?: string[];
}
