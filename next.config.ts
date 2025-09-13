import type { NextConfig } from 'next';

const basePath = process.env.NODE_ENV === 'production' ? '/md-editor-rt' : '';

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // swcMinify: false,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api']
  },
  basePath,
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader'
    });
    return config;
  },
  turbopack: {
    rules: {
      '*.md': {
        loaders: [
          {
            loader: 'raw-loader',
            options: {
              esModule: false
            }
          }
        ],
        as: '*.txt'
      }
    }
  }
  // redirects() {
  //   return Promise.resolve([
  //     {
  //       source: `${basePath}/`,
  //       destination: `${basePath}/en-US/`,
  //       permanent: true,
  //     },
  //     {
  //       source: `${basePath}/en-US/docs`,
  //       destination: `${basePath}/en-US/api`,
  //       permanent: true,
  //     },
  //     {
  //       source: `${basePath}/zh-CN/docs`,
  //       destination: `${basePath}/zh-CN/api`,
  //       permanent: true,
  //     },
  //     {
  //       source: `${basePath}/en-US/grammar`,
  //       destination: `${basePath}/en-US/syntax`,
  //       permanent: true,
  //     },
  //     {
  //       source: `${basePath}/zh-CN/grammar`,
  //       destination: `${basePath}/zh-CN/syntax`,
  //       permanent: true,
  //     },
  //   ]);
  // },
};

export default nextConfig;
