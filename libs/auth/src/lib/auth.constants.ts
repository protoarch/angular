export const ATTR_AUTHORIZE_CLAIM = 'authorize-claim';
export const ATTR_AUTHORIZE_CHILDREN = 'authorize-children';

export const CLAIM_FULL_ACCESS = 'FullAccess';

export const REGEXP_ACCESS_TYPE = /\[(.+?)\]/;
export const REGEXP_SEGMENT = /:\w+/g;
export const REGEXP_ALL_OCCURRENCES = /\*.*/g;
export const REGEXP_LAST_SLASH = /\/+$/g;
export const REGEXP_FIRST_SLASH = /^\//g;

export const RULES = [
    {
        /** example: clients/:id/products */
        rule: REGEXP_SEGMENT,
        template: '([^/]+)',
    },
    {
        /** example: clients/* */
        rule: REGEXP_ALL_OCCURRENCES,
        template: '(([^/].*)|($))',
    },
];

export const EXCEPTION_ROUTER_LINK = [
    {
        name: 'block',
        exception: '|'
    },
    {
        name: 'event',
        exception: '@'
    }
];
