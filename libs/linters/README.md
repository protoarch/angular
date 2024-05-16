# @protoarch.angular/linters

ESlint, Stylelint & Prettier rules for Angular applications.

## Setup

Install from npm

```bash
npm i @protoarch.angular/linters --save-dev
```

### ESLint + Prettier

Include configurations:

`.eslintrc.js`

```javascript
const {join} = require('path');

module.exports = {
    root: true,
    extends: ['./node_modules/@protoarch.angular/linters/eslint/index.js'],
    parserOptions: {
        ecmaVersion: 2022,
        project: join(__dirname, './tsconfig.json'),
        sourceType: 'module',
    },
};
```

`.prettierrc.js`

```javascript
module.exports = {
    ...require('./node_modules/@protoarch.angular/linters/prettier/prettier.config.js'),
};
```

Add npm-script:

```json
"lint": "npm exec -- eslint --config ./.eslintrc.js --debug "src/**/*.{js,ts,html}"",
"lint:fix": "npm exec -- eslint --config ./.eslintrc.js --fix --debug "src/**/*.{js,ts,html}""
```

Add `.eslintignore` file

```text
dist
node_modules
coverage
*.less
*.css
```

### Stylelint

`stylelint.config.js`

```javascript
const styleLint = require('@protoarch.angular/linters/stylelint/stylelint.config.js');

module.exports = {
    ...styleLint,
    rules: {
        ...styleLint.rules,
        'no-empty-source': null,
    },
};
```

Add npm-script:

```json
"lint": "npm exec -- stylelint --config ./.stylelintrc \"src/**/*.less\"",
"lint:fix": "npm exec -- stylelint --config ./.stylelintrc --fix \"src/**/*.less\""
```

#### VSCODE

> .vscode/settings.json

```json
"stylelint.validate": [
    "css",
    "less",
    "postcss",
    "scss"
],
```

#### WebStorm

Configure pattern in Preferences > Stylelint

```
{**/*,*}.{css,less,pcss,scss}
```
