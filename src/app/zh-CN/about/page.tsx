import { Metadata } from 'next';
import { DESCRIPTION_CN, KEYWORDS_CN } from '@/config';
import IzPreviewContent from '@/layouts/PreviewContent';
import mdText from '../../../../public/about-zh-CN.md';

export const metadata: Metadata = {
  title: '关于 - MdEditorV3 使用文档',
  keywords: KEYWORDS_CN,
  description: DESCRIPTION_CN,
};

export default async function Page() {
  return <IzPreviewContent editorId="md-about" value={mdText} />;
}
