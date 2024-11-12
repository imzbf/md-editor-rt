import { Metadata } from 'next';
import { KEYWORDS_EN, DESCRIPTION_EN, SITE_NAME_EN } from '@/config';
import IzPreviewContent from '@/layouts/PreviewContent';
import { replaceTemplate } from '@/utils';

import mdText from '../../../../public/demo-en-US.md';
import pack from '../../../..//package.json';

export const metadata: Metadata = {
  title: `Example - ${SITE_NAME_EN}`,
  keywords: KEYWORDS_EN,
  description: DESCRIPTION_EN,
};

const value = replaceTemplate(mdText, {
  EDITOR_VERSION: pack.dependencies['md-editor-rt'].replace('^', ''),
});

export default async function Page() {
  return <IzPreviewContent editorId="md-demo" value={value} />;
}
