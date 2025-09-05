// import js from '@eslint/js';
// import globals from 'globals';
// import reactHooks from 'eslint-plugin-react-hooks';
// import reactRefresh from 'eslint-plugin-react-refresh';
// import tseslint from 'typescript-eslint';

// export default tseslint.config(
//   { ignores: ['lib'] },
//   {
//     extends: [js.configs.recommended, ...tseslint.configs.recommended],
//     files: ['**/*.{ts,tsx}'],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser
//     },
//     plugins: {
//       'react-hooks': reactHooks,
//       'react-refresh': reactRefresh
//     },
//     rules: {
//       ...reactHooks.configs.recommended.rules,
//       'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
//       '@typescript-eslint/no-explicit-any': 'off'
//     }
//   }
// );

import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  {
    ignores: ['lib', 'eslint.config.mjs']
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    plugins: {
      import: importPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    settings: {
      'import/resolver': {
        typescript: {} // 使用 tsconfig.json 中的 paths 字段
      }
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      // 不强制所有函数必须显式声明返回类型
      '@typescript-eslint/explicit-function-return-type': 'off',
      // 不要求所有模块公有导出（函数、方法）必须显式声明参数与返回类型
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      // 关闭“对 any 类型变量赋值”的限制（例如：const a: any = ...）
      // 在某些快速开发场景中可容忍此类不安全赋值
      '@typescript-eslint/no-unsafe-assignment': 'off',
      // 关闭“对 any 类型成员访问”的限制（例如：a.b.c）
      // 适用于对第三方库、全局变量等非类型安全场景的宽松处理
      '@typescript-eslint/no-unsafe-member-access': 'off',
      // 关闭“对 any 类型函数返回值”的限制（例如：function foo(): any { ... }）
      '@typescript-eslint/no-unsafe-return': 'off',
      // 关闭“对 any 类型函数调用”的限制（例如：anyFunc()）
      // 可减少类型不完整时的报错干扰，但需自行保证调用安全性
      '@typescript-eslint/no-unsafe-call': 'off',
      // 关闭“未绑定方法直接赋值”的限制（例如：const fn = obj.method）
      // 在某些 class 实例或函数绑定场景下更方便使用
      '@typescript-eslint/unbound-method': 'off',

      // import 顺序规则
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'ignore',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true
          }
        }
      ]
    }
  }
);
