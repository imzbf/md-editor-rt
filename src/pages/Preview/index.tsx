import React, { useEffect, useMemo, useState, useRef } from 'react';
import { MdEditor, ExposeParam } from 'md-editor-rt';
import { useSelector } from 'react-redux';
import { Emoji, Mark, ExportPDF } from '@vavt/rt-extension';
import '@vavt/rt-extension/lib/asset/style.css';

import axios from '@/utils/request';
import { StateType } from '@/store';
import mdEN from '../../../public/preview-en-US.md';
import mdCN from '../../../public/preview-zh-CN.md';

import ReadExtension from '@/components/ReadExtension';
import TimeNow from '@/components/TimeNow';

import './index.less';

const editorId = 'editor-preview';

declare global {
  interface Window {
    editorInstance: any;
  }
}

export default () => {
  const [isDebug] = useState(() => {
    if (localStorage.getItem('debug')) {
      return true;
    }

    return false;
  });
  const state = useSelector((state: any) => state) as StateType;

  const [md, setMd] = useState(() => {
    return state.lang === 'zh-CN' ? mdCN : mdEN;
  });

  const editorRef = useRef<ExposeParam>();

  useEffect(() => {
    if (state.lang === 'zh-CN') {
      setMd(mdCN);
    } else {
      setMd(mdEN);
    }
  }, [state.lang]);

  const tips = useMemo(() => {
    switch (state.lang) {
      case 'zh-CN':
        return '示例中的标记、emoji、预览和时间扩展组件源码：';
      default:
        return 'Source code of mark, emoji, preview and time extension components in this page: ';
    }
  }, [state.lang]);

  useEffect(() => {
    if (isDebug) {
      editorRef.current?.on('catalog', (v) => {
        console.log('catalog', v);
      });
      editorRef.current?.on('fullscreen', (v) => {
        console.log('fullscreen', v);
      });
      editorRef.current?.on('htmlPreview', (v) => {
        console.log('htmlPreview', v);
      });
      editorRef.current?.on('pageFullscreen', (v) => {
        console.log('pageFullscreen', v);
      });
      editorRef.current?.on('preview', (v) => {
        console.log('preview', v);
      });

      window.editorInstance = editorRef.current;
    }
  }, [isDebug]);

  return (
    <div className="project-preview">
      <div className="container">
        <MdEditor
          ref={editorRef}
          theme={state.theme}
          previewTheme={state.previewTheme}
          codeTheme={state.codeTheme}
          modelValue={md}
          language={state.lang}
          editorId={editorId}
          autoDetectCode
          defToolbars={[
            <Mark key="mark-extension" />,
            <Emoji key="emoji-extension" />,
            <ReadExtension mdText={md} key="read-extension" />,
            <ExportPDF key="ExportPDF" modelValue={md} height="700px" />
          ]}
          onSave={(v, h) => {
            console.log('v', v);

            h.then((html) => {
              console.log('h', html);
            });
          }}
          toolbars={[
            'bold',
            'underline',
            'italic',
            'strikeThrough',
            '-',
            'title',
            'sub',
            'sup',
            'quote',
            'unorderedList',
            'orderedList',
            'task',
            '-',
            'codeRow',
            'code',
            'link',
            'image',
            'table',
            'mermaid',
            'katex',
            0,
            1,
            2,
            3,
            '-',
            'revoke',
            'next',
            'save',
            '=',
            'prettier',
            'pageFullscreen',
            'fullscreen',
            'preview',
            'previewOnly',
            'htmlPreview',
            'catalog',
            'github'
          ]}
          onChange={(value: string) => setMd(value)}
          onUploadImg={async (files: Array<File>, callback: (urls: string[]) => void) => {
            const res = await Promise.all(
              files.map((file) => {
                return new Promise((rev, rej) => {
                  const form = new FormData();
                  form.append('file', file);

                  axios
                    .post('/api/img/upload', form, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    })
                    .then((res: any) => rev(res))
                    .catch((error: any) => rej(error));
                });
              })
            );

            callback(res.map((item: any) => item.data.url));
          }}
          footers={['markdownTotal', '=', 0, 'scrollSwitch']}
          defFooters={[<TimeNow key="time-now" />]}
        />
        <br />
        <span className="tips-text">
          {tips}
          <a
            href="https://github.com/imzbf/md-editor-rt/tree/docs/src/components"
            target="_blank"
          >
            components
          </a>
        </span>
      </div>
    </div>
  );
};
