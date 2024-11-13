import { Html, Head, Main, NextScript } from 'next/document';
import Script from 'next/script';

import { useLang } from '@/hooks/router';

export default function Document() {
  const lang = useLang();

  return (
    <Html lang={lang}>
      <Head />
      <body>
        <Main />
        <NextScript />
        <Script src="//at.alicdn.com/t/c/font_2818624_gbt6qvt9lob.js" />
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              async
              src="https://www.googletagmanager.com/gtag/js?id=G-3R6P1XE0H0"
            />
            <Script id="gg">
              {`window.dataLayer = window.dataLayer || [];
                function gtag() {
                  dataLayer.push(arguments);
                }
                gtag('js', new Date());
                gtag('config', 'G-3R6P1XE0H0');`}
            </Script>
            <Script src="https://hm.baidu.com/hm.js?1563bc52cb27ffbc7b5b46cdfc327ce0" />
          </>
        )}
      </body>
    </Html>
  );
}
