import type { AppProps } from 'next/app';
import AppLayout from '@/layouts';

import 'md-editor-rt/lib/style.css';
import '@vavt/cm-extension/dist/previewTheme/arknights.css';
import '@vavt/rt-extension/lib/asset/style.css';
import '@/styles/common.scss';

export default function App({ Component, pageProps }: AppProps) {
  return (
    // <div className="docs-page">
    <AppLayout>
      <Component {...pageProps} />
    </AppLayout>
    // </div>
  );
}
