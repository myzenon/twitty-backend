module.exports = {
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module",
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
    ],
    "env": {
        "node": true,
    },
    "rules": {
        "no-undef": "off",
        "key-spacing": "warn",
        "keyword-spacing": "warn",
        "indent": [ "warn", 4, { "SwitchCase": 1 } ],
        "no-trailing-spaces": "warn",
        "no-multi-spaces": "warn",
        "space-unary-ops": "warn",
        "no-multiple-empty-lines": "warn",
        "object-curly-spacing": [ "warn", "always" ],
        "space-before-blocks": "warn",
        "array-bracket-spacing": [ "warn", "always" ],
        "comma-spacing": "warn",
        "space-in-parens": "warn",
        "eol-last": "warn",
        "semi": [ "error", "never" ],
        "brace-style": [ "warn", "stroustrup" ],
        "no-console": [ "warn" ],
        "no-unused-vars": "off",
        "comma-dangle": [ "warn", "always-multiline" ],
        "no-control-regex": 0,
        "@typescript-eslint/member-delimiter-style": [ "warn", {
            "multiline": {
                "delimiter": "none",
            },
            "singleline": {
                "delimiter": "comma",
                "requireLast": true,
            },
        } ],
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": [ "warn" ],
    },
}
