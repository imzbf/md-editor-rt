import { rmSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { build, LibraryFormats } from 'vite';
import { buildType } from './build.type';

const __dirname = fileURLToPath(new URL('..', import.meta.url));
const resolvePath = (p: string) => path.resolve(__dirname, p);

void (async () => {
  const moduleEntry = {
    index: resolvePath('packages'),
    MdEditor: resolvePath('packages/MdEditor'),
    MdPreview: resolvePath('packages/MdPreview'),
    NormalToolbar: resolvePath('packages/NormalToolbar'),
    DropdownToolbar: resolvePath('packages/DropdownToolbar'),
    ModalToolbar: resolvePath('packages/ModalToolbar'),
    MdCatalog: resolvePath('packages/MdCatalog'),
    MdModal: resolvePath('packages/MdEditor/components/Modal'),
    config: resolvePath('packages/config')
  };

  const entries: Array<[LibraryFormats, any]> = [
    [
      'es',
      {
        ...moduleEntry,
        // 这里只有利用vite构建的assetFileNames为文件名的特性构建样式文件
        preview: resolvePath('packages/MdEditor/styles/preview.less'),
        style: resolvePath('packages/MdEditor/styles/style.less')
      }
    ],
    ['cjs', moduleEntry]
  ];

  const extnames = {
    es: 'mjs',
    cjs: 'cjs'
  };

  rmSync(resolvePath('lib'), { recursive: true, force: true });

  buildType();

  await Promise.all(
    entries.map(([t, entry]) => {
      return build({
        base: '/',
        publicDir: false,
        define: {
          // vite没有标记这个常理，在打包的时候，会将runtime-dev打包进去
          'process.env.NODE_ENV': '"production"'
        },
        resolve: {
          alias: {
            '~~': resolvePath('packages'),
            '~': resolvePath('packages/MdEditor')
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
          emptyOutDir: false,
          cssCodeSplit: true,
          outDir: resolvePath('lib'),
          lib: {
            entry,
            name: 'MdEditorRT',
            formats: [t],
            fileName(format) {
              switch (format) {
                case 'es': {
                  return 'es/[name].mjs';
                }
                case 'cjs': {
                  return 'cjs/[name].cjs';
                }
                default: {
                  return 'umd/[name].js';
                }
              }
            }
          },
          rollupOptions: {
            external: [
              'react',
              'react-dom',
              'react-dom/client',
              'react/jsx-runtime',
              'medium-zoom',
              'lru-cache',
              'codemirror',
              'lucide-react',
              /@vavt\/.*/,
              /@codemirror\/.*/,
              /@lezer\/.*/,
              /markdown-it.*/
            ],
            output: {
              chunkFileNames: `${t}/chunks/[name].${extnames[t]}`,
              assetFileNames: '[name][extname]'
            }
          }
        }
      });
    })
  );
})();
