import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { DESCRIPTION_EN, KEYWORDS_EN, SITE_NAME_EN } from '@/config';

export const metadata: Metadata = {
  title: `Redirect - ${SITE_NAME_EN}`,
  keywords: KEYWORDS_EN,
  description: DESCRIPTION_EN,
};

export default function NotFound() {
  redirect('/en-US/');
}
