import path from 'path';
import { UserConfigExport, ConfigEnv } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import nodeService from './vitePlugins/nodeService';
import { homepage } from './package.json';

import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  console.log('mode：', mode);

  return {
    base: mode === 'preview' ? homepage : '/',
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
      mode !== 'production' && nodeService(),
      mode !== 'production' && reactRefresh(),
      mode === 'production' &&
        dts({
          include: [
            './MdEditor/type.ts',
            './MdEditor/Editor.tsx',
            './MdEditor/NormalToolbar.tsx',
            './MdEditor/DropdownToolbar.tsx',
            './MdEditor/layouts/Catalog/index.tsx'
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
    build:
      mode === 'production'
        ? {
            outDir: path.resolve(__dirname, 'lib'),
            lib: {
              entry: path.resolve(__dirname, './MdEditor/Editor.tsx'),
              name: 'MdEditorRT',
              formats: ['es']
              // fileName: (): string => 'md-editor-rt.js'
            },
            rollupOptions: {
              external: ['react'],
              output: {
                globals: {
                  react: 'React'
                }
              }
            }
          }
        : {}
  };
};
