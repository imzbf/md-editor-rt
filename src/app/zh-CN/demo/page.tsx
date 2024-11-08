import { Metadata } from 'next';
import { DESCRIPTION_CN, KEYWORDS_CN, SITE_NAME_CN } from '@/config';
import IzPreviewContent from '@/layouts/PreviewContent';
import mdText from '../../../../public/demo-zh-CN.md';

export const metadata: Metadata = {
  title: `示例 - ${SITE_NAME_CN}`,
  keywords: KEYWORDS_CN,
  description: DESCRIPTION_CN,
};

export default async function Page() {
  return <IzPreviewContent editorId="md-demo" value={mdText} />;
}
