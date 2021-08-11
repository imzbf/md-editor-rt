import { Plugin, ViteDevServer } from 'vite';
import multiparty from 'multiparty';
import fs from 'fs';
import path from 'path';

const LOCAL_IMG_PATH = path.resolve(__dirname, '../temp.local');

export default (): Plugin => {
  return {
    name: 'node-service',
    configureServer: (server: ViteDevServer) => {
      server.middlewares.use(async (req, res, next) => {
        if (/^\/api\/img\/upload$/.test(req.url)) {
          if (!fs.existsSync(LOCAL_IMG_PATH)) {
            fs.mkdirSync(LOCAL_IMG_PATH);
          }

          const form = new multiparty.Form({
            uploadDir: LOCAL_IMG_PATH
          });

          form.parse(req, () => {});

          res.end(
            JSON.stringify({
              code: 0,
              url: 'https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb468550ee274210a20bd213848fa4d0~tplv-k3u1fbpfcp-watermark.awebp'
            })
          );
        } else {
          next();
        }
      });
    }
  };
};
