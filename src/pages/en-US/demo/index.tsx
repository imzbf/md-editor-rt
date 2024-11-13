import Head from 'next/head';

import { KEYWORDS_EN, DESCRIPTION_EN, SITE_NAME_EN } from '@/config';
import IzPreviewContent from '@/layouts/PreviewContent';
import { replaceTemplate } from '@/utils';

import mdText from '../../../../public/demo-en-US.md';
import pack from '../../../..//package.json';

const value = replaceTemplate(mdText, {
  EDITOR_VERSION: pack.dependencies['md-editor-rt'].replace('^', ''),
});

export default function Page() {
  return (
    <>
      <Head>
        <title>{`Examples - ${SITE_NAME_EN}`}</title>
        <meta name="keywords" content={KEYWORDS_EN} />
        <meta name="description" content={DESCRIPTION_EN} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <IzPreviewContent editorId="md-demo-en" value={value} />
    </>
  );
}
