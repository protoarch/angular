module.exports = {
    root: true,
    ignorePatterns: ['**/*'],
    extends: ['./libs/linters/linters/eslint/index.js'],
    plugins: ['@nrwl/nx'],
    env: {
        jest: true,
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
            rules: {
                '@nrwl/nx/enforce-module-boundaries': [
                    'error',
                    {
                        enforceBuildableLibDependency: true,
                        allow: [],
                        depConstraints: [
                            {
                                sourceTag: '*',
                                onlyDependOnLibsWithTags: ['*'],
                            },
                        ],
                    },
                ],
            },
        },
        {
            files: ['*.ts', '*.tsx'],
            extends: ['plugin:@nrwl/nx/typescript'],
            rules: {},
        },
        {
            files: ['*.ts'],
            parserOptions: {
                project: './tsconfig.base.json',
                tsconfigRootDir: __dirname,
            },
        },
        {
            files: ['*.js', '*.jsx'],
            extends: ['plugin:@nrwl/nx/javascript'],
            rules: {},
        },
        {
            files: ['*.ts'],
            extends: [
                'plugin:@nrwl/nx/angular',
                'plugin:@angular-eslint/template/process-inline-templates',
            ],
            rules: {
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        type: 'attribute',
                        prefix: 'prt',
                        style: 'camelCase',
                    },
                ],
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        type: 'element',
                        prefix: 'prt',
                        style: 'kebab-case',
                    },
                ],
            },
        },
        {
            files: ['*.html'],
            extends: ['plugin:@nrwl/nx/angular-template'],
            rules: {},
        },
    ],
};
