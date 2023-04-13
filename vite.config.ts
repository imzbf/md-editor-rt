import path from 'path';
import { UserConfigExport, ConfigEnv, BuildOptions } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import nodeService from './vitePlugins/nodeService';
import markdown from '@vavt/vite-plugin-import-markdown';

import { name } from './package.json';

const OUT_DIR = 'lib';

const libBuildOptions: BuildOptions = {
  outDir: path.resolve(__dirname, OUT_DIR),
  lib: {
    entry: path.resolve(__dirname, './MdEditor/index.ts'),
    name: 'MdEditorRT',
    formats: ['es', 'cjs', 'umd'],
    fileName(format) {
      switch (format) {
        case 'es': {
          return `${name}.mjs`;
        }
        case 'cjs': {
          return `${name}.cjs`;
        }
        case 'umd': {
          return `${name}.umd.js`;
        }
      }
    }
  },
  rollupOptions: {
    external: [
      'react',
      'medium-zoom',
      'lru-cache',
      'copy-to-clipboard',
      '@vavt/markdown-theme',
      'codemirror',
      /@codemirror\/.*/,
      /@lezer\/.*/,
      /markdown-it.*/
    ],
    output: {
      globals: {
        react: 'React'
      }
    }
  }
};

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  console.log('mode：', mode);

  return {
    base: '/',
    publicDir: mode === 'production' ? false : './dev/public',
    server: {
      host: 'localhost',
      open: true,
      port: 2233,
      https: false
    },
    resolve: {
      alias: {
        // 键必须以斜线开始和结束
        '@': path.resolve(__dirname, './dev'),
        '~': path.resolve(__dirname, './MdEditor')
      }
    },
    plugins: [
      react({
        babel: {
          babelrc: true
        }
      }),
      mode !== 'production' && nodeService(),
      mode !== 'production' && markdown(),
      mode === 'production' &&
        dts({
          outputDir: `${OUT_DIR}/MdEditor`,
          include: [
            './MdEditor/type.ts',
            './MdEditor/Editor.tsx',
            './MdEditor/extensions/**/*.tsx',
            './MdEditor/index.ts',
            './MdEditor/config.ts'
          ]
        })
    ],
    css: {
      modules: {
        localsConvention: 'camelCase' // 默认只支持驼峰，修改为同事支持横线和驼峰
      },
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    },
    build: mode === 'production' ? libBuildOptions : {}
  };
};
