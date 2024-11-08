import { Metadata } from 'next';
import { DESCRIPTION_EN, KEYWORDS_EN, SITE_NAME_EN } from '@/config';
import HomePage from '@/app/zh-CN/client';
import mdText from '../../../public/preview-en-US.md';

export const metadata: Metadata = {
  title: `HomePage - ${SITE_NAME_EN}`,
  keywords: KEYWORDS_EN,
  description: DESCRIPTION_EN,
};
export default function Home() {
  return (
    <HomePage
      mdText={mdText}
      tips="Source code of mark, emoji, preview and time extension components in this page: "
    />
  );
}
