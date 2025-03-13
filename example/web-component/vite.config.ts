import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdown from '@vavt/vite-plugin-import-markdown';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    markdown(),
    cssInjectedByJsPlugin({
      styleId: 'custom_id'
    })
  ]
});
