import Head from 'next/head';

import { DESCRIPTION_CN, KEYWORDS_CN, SITE_NAME_CN } from '@/config';
import IzPreviewContent from '@/layouts/PreviewContent';
import { replaceTemplate } from '@/utils';

import pack from '../../../..//package.json';
import mdText from '../../../../public/demo-zh-CN.md';

const value = replaceTemplate(mdText as string, {
  EDITOR_VERSION: pack.dependencies['md-editor-rt'].replace('^', '')
});

export default function Page() {
  return (
    <>
      <Head>
        <title>{`示例 - ${SITE_NAME_CN}`}</title>
        <meta name="keywords" content={KEYWORDS_CN} />
        <meta name="description" content={DESCRIPTION_CN} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <IzPreviewContent editorId="md-demo-zh" value={value} />
    </>
  );
}
