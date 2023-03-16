import path from 'path';
import { UserConfigExport, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import nodeService from './vitePlugins/nodeService';
import markdownImport from './vitePlugins/markdownImport';

import dts from 'vite-plugin-dts';

const OUT_DIR = 'lib';

const libBuildOptions = {
  outDir: path.resolve(__dirname, OUT_DIR),
  lib: {
    entry: path.resolve(__dirname, './MdEditor/index.ts'),
    name: 'MdEditorRT'
  },
  rollupOptions: {
    external: ['react'],
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
        '@': path.resolve(__dirname, './dev')
      }
    },
    plugins: [
      react({
        babel: {
          babelrc: true
        }
      }),
      mode !== 'production' && nodeService(),
      mode !== 'production' && markdownImport(),
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
