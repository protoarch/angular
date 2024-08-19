module.exports = {
    ignorePatterns: ['node_modules', 'dist', '**/jest.config.ts'],
    plugins: ['rxjs', '@typescript-eslint/eslint-plugin', 'simple-import-sort'],
    env: {
        browser: true,
        es2020: true,
        jest: true,
    },
    overrides: [
        {
            files: ['*.ts'],
            parser: '@typescript-eslint/parser',
            parserOptions: {project: ['tsconfig.json']},
            extends: [
                'plugin:@typescript-eslint/eslint-recommended',
                'plugin:@angular-eslint/all',
                'plugin:prettier/recommended',
            ],
            rules: {
                '@angular-eslint/no-host-metadata-property': 'off',
                '@angular-eslint/use-component-view-encapsulation': 'off',
                '@angular-eslint/prefer-standalone': 'off',
                '@angular-eslint/prefer-standalone-component': 'off',
                '@angular-eslint/use-injectable-provided-in': 'off',

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
                '@typescript-eslint/member-ordering': 'error',

                'simple-import-sort/imports': 'error',
            },
        },
        {
            files: ['*.html'],
            extends: ['plugin:@angular-eslint/template/recommended'],
            rules: {},
        },
    ],
};
