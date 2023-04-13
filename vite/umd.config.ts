import path from 'path';
import { UserConfigExport, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';

import { name } from '../package.json';

export default ({ mode }: ConfigEnv): UserConfigExport => {
  console.log('mode：', mode);

  return {
    publicDir: false,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '../dev'),
        '~': path.resolve(__dirname, '../MdEditor')
      }
    },
    plugins: [react()],
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
    build: {
      outDir: path.resolve(__dirname, '../lib'),
      lib: {
        entry: path.resolve(__dirname, '../MdEditor'),
        name: 'MdEditorRT',
        formats: ['umd'],
        fileName(format) {
          switch (format) {
            case 'umd': {
              return `${name}.umd.js`;
            }
          }

          return '';
        }
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
  };
};
