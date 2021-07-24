import { AuthOptions, AuthorizePromptOptions, User } from './models';

export const AUTH_OPTIONS_DEFAULTS: AuthOptions<User> = {
    tokenName: 'access_token',
    tokenEndpoint: '/identity/connect/token',
    userType: User,
    storageTokenName: 'app_access_token'
};
export const PROMPT_OPTIONS_DEFAULTS: AuthorizePromptOptions = {
    enableDevHotkey: false,
    style: '3px dashed #2be8d9'
};
