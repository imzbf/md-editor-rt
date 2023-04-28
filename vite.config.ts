import path from 'path';
import { UserConfigExport, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react';
import nodeService from './vitePlugins/nodeService';
import markdown from '@vavt/vite-plugin-import-markdown';
import { homepage } from './package.json';

// https://vitejs.dev/config/
export default ({ mode }: ConfigEnv): UserConfigExport => {
  console.log('mode：', mode);

  return {
    base: mode === 'preview' ? homepage : '',
    publicDir: mode === 'production' ? false : './public',
    server: {
      host: 'localhost',
      open: '/md-editor-rt/zh-CN/index',
      port: 2234,
      https: false
    },
    resolve: {
      alias: {
        // 键必须以斜线开始和结束
        '@': path.resolve(__dirname, './src')
      }
    },
    plugins: [
      mode !== 'production' && nodeService(),
      mode !== 'production' && react(),
      mode !== 'production' && markdown()
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
    esbuild: {
      logOverride: { 'this-is-undefined-in-esm': 'silent' }
    }
  };
};
