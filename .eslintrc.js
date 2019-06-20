module.exports = {
  extends: [
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:node/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  overrides: [
    {
      files: ['*.test.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: ['jest', 'prettier'],
  rules: {
    'node/no-unsupported-features/es-syntax': [
      'error',
      {
        ignores: ['modules'],
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
};
