module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    // off允许匿名组件
    'react/display-name': 'off',
    // 要求组件引入React，配合tsconfig的compilerOptions.jsx设置为react或preserve而非react-jsx（主要兼容react@16）
    'react/react-in-jsx-scope': 'error',
    'react-hooks/rules-of-hooks': 'error',
    // 提示hooks缓存依赖项
    'react-hooks/exhaustive-deps': 'warn',
    // a.x!
    '@typescript-eslint/no-non-null-assertion': 'off'
  }
};
