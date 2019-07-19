module.exports = {
    extends: ['eslint:recommended', 'prettier'],
    plugins: ['prettier'],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module"
    },
    globals: {
        Promise: true,
        t: true,
        require: true,
        global: true,
        __dirname: true
    },
    rules: {
      'prettier/prettier': [
        'error',
            {
                singleQuote: true
            },
        ],
        eqeqeq: ['error', 'always'],
    },
};
