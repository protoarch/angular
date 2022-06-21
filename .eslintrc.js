module.exports = {
    root: true,
    extends: ['./libs/linters/linters/eslint/index.js'],
    overrides: [
        {
            files: ['*.component.html'],
            rules: {
                'max-len': 'off',
            },
        },
    ],
};
