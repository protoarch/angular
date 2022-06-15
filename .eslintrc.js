module.exports = {
    root: true,
    extends: ['./libs/linters/linters/eslint/index.js'],
    overrides: [
        {
            files: ['*.ts', '!jest.config.ts'],
            parserOptions: {
                project: './tsconfig.base.json',
                tsconfigRootDir: __dirname,
            },
        },
        {
            files: ['*.component.html'],
            rules: {
                'max-len': 'off',
            },
        },
    ],
};
