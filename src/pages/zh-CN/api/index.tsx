import Head from 'next/head';

import { DESCRIPTION_CN, KEYWORDS_CN, SITE_NAME_CN } from '@/config';
import IzPreviewContent from '@/layouts/PreviewContent';
import mdText from '../../../../public/api-zh-CN.md';

export default function Page() {
  return (
    <>
      <Head>
        <title>{`API - ${SITE_NAME_CN}`}</title>
        <meta name="keywords" content={KEYWORDS_CN} />
        <meta name="description" content={DESCRIPTION_CN} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <IzPreviewContent editorId="md-api-zh" value={mdText} />
    </>
  );
}