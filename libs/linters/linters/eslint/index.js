'use strict';

module.exports = {
    ignorePatterns: ['node_modules', 'dist'],
    plugins: ['rxjs'],
    env: {
        browser: true,
        es2020: true,
        jest: true,
    },
    overrides: [
        {
            files: ['*.ts'],
            parserOptions: {
                createDefaultProgram: true,
            },
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@angular-eslint/all',
                'plugin:prettier/recommended',
            ],
            rules: {
                '@angular-eslint/no-host-metadata-property': 'off',
                '@angular-eslint/use-component-view-encapsulation': 'off',

                'rxjs/no-async-subscribe': 'error',
                'rxjs/no-ignored-observable': 'error',
                'rxjs/no-nested-subscribe': 'error',
                'rxjs/no-unbound-methods': 'error',
                'rxjs/throw-error': 'error',
                'rxjs/no-subject-value': 'error',
                'rxjs/suffix-subjects': ['error', {suffix: '$'}],
                'rxjs/prefer-observer': 'error',

                'no-var': 'error',
                '@typescript-eslint/no-unused-vars': ['warn', {vars: 'all', args: 'none'}],
                '@typescript-eslint/array-type': [
                    'error',
                    {
                        default: 'array-simple',
                    },
                ],
                quotes: [
                    'error',
                    'single',
                    {
                        avoidEscape: true,
                    },
                ],
                'max-len': [
                    'error',
                    {
                        code: 160,
                        ignoreUrls: true,
                        ignoreComments: true,
                        ignorePattern: '^import |^export +(.*?)',
                        ignoreRegExpLiterals: true,
                    },
                ],

                'grouped-accessor-pairs': ['error', 'setBeforeGet'],
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'typeLike',
                        format: ['PascalCase'],
                    },
                    {
                        selector: 'property',
                        modifiers: ['private'],
                        format: ['camelCase'],
                        leadingUnderscore: 'require',
                    },
                    {
                        selector: 'variable',
                        format: ['camelCase', 'UPPER_CASE'],
                        leadingUnderscore: 'allow',
                    },
                ],
                '@typescript-eslint/member-ordering': [
                    'error',
                    {
                        default: [
                            // Index signature
                            'signature',

                            // Fields
                            'private-static-field',
                            'protected-static-field',
                            'public-static-field',

                            'private-instance-field',
                            'private-decorated-field',
                            'protected-decorated-field',
                            'protected-instance-field',
                            'public-decorated-field',
                            'public-instance-field',

                            'private-abstract-field',
                            'protected-abstract-field',
                            'public-abstract-field',

                            'private-constructor',
                            'protected-constructor',
                            'public-constructor',

                            'public-static-method',
                            'protected-static-method',
                            'private-static-method',

                            'public-decorated-method',
                            'protected-decorated-method',
                            'private-decorated-method',

                            'public-instance-method',
                            'protected-instance-method',
                            'private-instance-method',

                            'public-abstract-method',
                            'protected-abstract-method',
                            'private-abstract-method',
                        ],
                    },
                ],
            },
        },
        {
            files: ['*.html'],
            extends: ['plugin:@angular-eslint/template/recommended'],
            rules: {},
        },
    ],
};
