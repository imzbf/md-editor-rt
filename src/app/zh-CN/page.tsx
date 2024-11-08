import { Metadata } from 'next';
import { DESCRIPTION_CN, KEYWORDS_CN, SITE_NAME_CN } from '@/config';
import HomePage from './client';
import mdText from '../../../public/preview-zh-CN.md';

export const metadata: Metadata = {
  title: `首页 - ${SITE_NAME_CN}`,
  keywords: KEYWORDS_CN,
  description: DESCRIPTION_CN,
};

export default function Home() {
  return (
    <HomePage
      mdText={mdText}
      tips="示例中的标记、emoji、预览和时间扩展组件源码："
    />
  );
}
