import { useState } from 'react';
import { MdEditor, MdPreview, MdCatalog } from 'md-editor-rt';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [text, setText] = useState(
    '# md-editor-rt\n\n## Next.js\n\nEdit this Markdown to update the preview.'
  );
  const previewId = 'article-preview';

  return (
    <main className={styles.main}>
      <Head>
        <title>md-editor-rt · Next.js</title>
        <meta
          name="description"
          content="Markdown editing, preview and catalog in Next.js."
        />
      </Head>
      <h1>Markdown editor</h1>
      <MdEditor id="article-editor" value={text} onChange={setText} />
      <h2>Article preview</h2>
      <div className={styles.article}>
        <MdPreview id={previewId} value={text} />
        <aside aria-label="Article contents">
          {/* A selector keeps this page safe to render on the server. */}
          <MdCatalog editorId={previewId} scrollElement="html" />
        </aside>
      </div>
    </main>
  );
}
