import Head from 'next/head';
import { ROUTE_PREFIX } from '@/config';

export default function Page() {
  return (
    <>
      <Head>
        <meta
          httpEquiv="refresh"
          content={`0;url=${ROUTE_PREFIX}/en-US/syntax`}
        />
      </Head>
    </>
  );
}
