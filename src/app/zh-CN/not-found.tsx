import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { DESCRIPTION_CN, KEYWORDS_CN, SITE_NAME_CN } from '@/config';

export const metadata: Metadata = {
  title: `正在重定向 - ${SITE_NAME_CN}`,
  keywords: KEYWORDS_CN,
  description: DESCRIPTION_CN,
};

export default function NotFound() {
  redirect('/zh-CN/');
}
