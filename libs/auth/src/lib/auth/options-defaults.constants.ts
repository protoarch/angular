import {PERMISSION_FULL_ACCESS} from '../auth.constants';
import {AuthOptions, AuthorizePromptOptions, User} from './models';

export const AUTH_OPTIONS_DEFAULTS: AuthOptions<User> = {
    tokenName: 'access_token',
    tokenEndpoint: '/identity/connect/token',
    userType: User,
    storageTokenName: 'access_token',
    superPermission: PERMISSION_FULL_ACCESS,
};
export const PROMPT_OPTIONS_DEFAULTS: AuthorizePromptOptions = {
    enableDevHotkey: false,
    style: '3px dashed #2be8d9',
};
