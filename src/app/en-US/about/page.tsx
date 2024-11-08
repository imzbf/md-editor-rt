import { Metadata } from 'next';

import { KEYWORDS_EN, DESCRIPTION_EN, SITE_NAME_EN } from '@/config';
import IzPreviewContent from '@/layouts/PreviewContent';
import mdText from '../../../../public/about-en-US.md';

export const metadata: Metadata = {
  title: `About - ${SITE_NAME_EN}`,
  keywords: KEYWORDS_EN,
  description: DESCRIPTION_EN,
};

export default async function Page() {
  return <IzPreviewContent editorId="md-about" value={mdText} />;
}
