import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // reactStrictMode: false,
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  // swcMinify: false,
  sassOptions: {
    silenceDeprecations: ['legacy-js-api'],
  },
  basePath: process.env.NODE_ENV === 'production' ? '/md-editor-rt' : '',
  webpack(config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    });
    return config;
  },
  experimental: {
    turbo: {
      rules: {
        '*.md': {
          loaders: [
            {
              loader: 'raw-loader',
              options: {
                esModule: false,
              },
            },
          ],
          as: '*.txt',
        },
      },
    },
  },
};

export default nextConfig;
