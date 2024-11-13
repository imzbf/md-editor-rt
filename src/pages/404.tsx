import Head from 'next/head';
import Script from 'next/script';
import { ROUTE_PREFIX } from '@/config';

export default function Page() {
  return (
    <>
      <Head>
        <meta httpEquiv="refresh" content={`0;url=${ROUTE_PREFIX}`} />
      </Head>
      <Script id="rt404">{`sessionStorage.redirect = location.href;`}</Script>
    </>
  );
}
