module.exports = {
    'env': {
        'browser': true,
        'es6': true,
        'node': true
    },
    globals: {
        __PATH_PREFIX__: true,
    },
    'extends': [
        'react-app',
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:react/recommended',
        'plugin:promise/recommended'
    ],
    'plugins': [
        'promise',
        'react',
        'import'
    ],
    'overrides': [
        {
            'files': [
                'gatsby-node.js',
                'gatsby-config.js',
            ],
            'rules': {
                'no-console': 'off',
            }
        }
    ],
    'rules': {
        'comma-spacing': 2,
        'eol-last': 2,
        'import/extensions': ['error', 'ignorePackages', {'js': 'never', 'jsx': 'never'}],
        'import/no-unresolved': [2, {
            ignore: [
                '@gatsbyjs/reach-router' // we need to load the one provided by gatsby so they match up and stuff
            ]
        }],
        'indent': ['error', 4],
        'jsx-quotes': 2,
        'key-spacing': [2],
        'max-len': 0,
        'no-console': 2,
        'no-extra-semi': 2,
        'no-multi-spaces': 'error',
        'no-trailing-spaces': [2, {'skipBlankLines': true}],
        'no-undef': 2,
        'no-underscore-dangle': [0],
        'no-unused-vars': [2],
        'no-var': 2,
        'object-curly-spacing': ['error', 'never'],
        'object-shorthand': [0, 'always'],
        'prefer-arrow-callback': 2,
        'prefer-const': 2,
        'prefer-template': 2,
        'quote-props': [0, 'as-needed'],
        'quotes': [2, 'single'],
        'react/display-name': 0,
        'react/jsx-boolean-value': 2,
        'react/jsx-curly-spacing': [2, {'allowMultiline': true, 'when': 'never'}],
        'react/jsx-equals-spacing': [2, 'never'],
        'react/jsx-filename-extension': [1, {'extensions': ['.js', '.jsx']}],
        'react/jsx-indent': ['error', 4, {'checkAttributes': true, 'indentLogicalExpressions': true}],
        'react/jsx-no-undef': 2,
        'react/jsx-one-expression-per-line': ['error', {'allow': 'single-child'}],
        'react/jsx-sort-props': 0,
        'react/jsx-uses-react': 2,
        'react/jsx-uses-vars': 2,
        'react/jsx-wrap-multilines': 2,
        'react/no-did-mount-set-state': 2,
        'react/no-did-update-set-state': 2,
        'react/no-multi-comp': 0,
        'react/no-unknown-property': 2,
        'react/prop-types': 2,
        'react/react-in-jsx-scope': 2,
        'react/self-closing-comp': 2,
        'semi': [2],
        'space-before-function-paren': [2, {'anonymous': 'always', 'named': 'never'}],
        'strict': [2, 'global'],
    },
    'settings': {
        'import/extensions': ['.js', '.jsx'],
        'import/resolver': {'node': {'extensions': ['.js', '.jsx']}},
        'react': {'version': 'detect'},
    },
};
