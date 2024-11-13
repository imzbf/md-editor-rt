import Head from 'next/head';

import { KEYWORDS_EN, DESCRIPTION_EN, SITE_NAME_EN } from '@/config';
import IzPreviewContent from '@/layouts/PreviewContent';
import mdText from '../../../../public/api-en-US.md';

export default function Page() {
  return (
    <>
      <Head>
        <title>{`API - ${SITE_NAME_EN}`}</title>
        <meta name="keywords" content={KEYWORDS_EN} />
        <meta name="description" content={DESCRIPTION_EN} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <IzPreviewContent editorId="md-api-en" value={mdText} />
    </>
  );
}
