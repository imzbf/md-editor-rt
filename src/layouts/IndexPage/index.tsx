import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { MdEditor, ExposeParam, Footers } from 'md-editor-rt';
import { Emoji, Mark, ExportPDF } from '@vavt/rt-extension';
import { isMobile } from '@vavt/util';
import { message } from '@vavt/message';

import axios from '@/utils/request';
import { toolbars } from './staticConfig';

import TimeNow from '@/components/TimeNow';

import { useLang } from '@/hooks/router';
import { useAppSelector } from '@/hooks/store';
import Head from 'next/head';

import {
  DESCRIPTION_CN,
  DESCRIPTION_EN,
  KEYWORDS_CN,
  KEYWORDS_EN,
  SITE_NAME_CN,
  SITE_NAME_EN,
} from '@/config';

const editorId = 'editor-preview';

// declare global {
//   interface Window {
//     editorInstance: any;
//   }
// }

let updateRatio: ((str: string) => void) | undefined;
let closrRatio = () => {};

const onProgress = ({ ratio }: { ratio: number }) => {
  if (updateRatio) {
    updateRatio(`Progress: ${ratio * 100}%`);
  } else {
    const { close, update } = message.info(`Progress: ${ratio * 100}%`, {
      zIndex: 999999,
      duration: 0,
    });

    updateRatio = update;
    closrRatio = close;
  }
};

const onSuccess = () => {
  closrRatio();

  setTimeout(() => {
    updateRatio = undefined;
  }, 100);

  message.success('Export successful.', {
    zIndex: 999999,
  });
};

const footers: Footers[] = ['markdownTotal', '=', 0, 'scrollSwitch'];

const HomePage = ({ mdText, tips }: { mdText: string; tips: string }) => {
  const state = useAppSelector((state) => state.setting);
  const lang = useLang();

  const [md, setMd] = useState(mdText);

  const [isDebug, setIsDebug] = useState(() => {
    return false;
  });

  const [ufToolbars, setToolbars] = useState(toolbars);
  const [inputBoxWidth, setInputBoxWidth] = useState('50%');

  const editorRef = useRef<ExposeParam>();

  const { SITE_NAME, KEYWORDS, DESCRIPTION } = useMemo(() => {
    return {
      SITE_NAME:
        lang === 'zh-CN'
          ? `首页 - ${SITE_NAME_CN}`
          : `HomePage - ${SITE_NAME_EN}`,
      KEYWORDS: lang === 'zh-CN' ? KEYWORDS_CN : KEYWORDS_EN,
      DESCRIPTION: lang === 'zh-CN' ? DESCRIPTION_CN : DESCRIPTION_EN,
    };
  }, [lang]);

  const changeLayout = useCallback(() => {
    if (isMobile()) {
      // 在移动端不现实分屏预览，要么编辑，要么仅预览
      setToolbars(() => {
        const t = toolbars.filter(
          (item) =>
            !(['preview', 'previewOnly'] as Array<string | number>).includes(
              item
            )
        );

        return ['previewOnly', ...t];
      });
      setInputBoxWidth('100%');
      editorRef.current?.togglePreview(false);
    } else {
      setToolbars(toolbars);
      setInputBoxWidth('50%');
      editorRef.current?.togglePreview(true);
    }
  }, []);

  const onSave = useCallback((v: string, h: Promise<string>) => {
    console.log('v', v);

    h.then((html) => {
      console.log('h', html);
    });
  }, []);

  const onUploadImg = useCallback(
    async (files: Array<File>, callback: (urls: string[]) => void) => {
      const res = await Promise.all(
        files.map((file) => {
          return new Promise((rev, rej) => {
            const form = new FormData();
            form.append('file', file);

            axios
              .post('/api/img/upload', form, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then((res: unknown) => rev(res))
              .catch((error: unknown) => rej(error));
          });
        })
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      callback(res.map((item: any) => item.data.url));
    },
    []
  );

  const defToolbars = useMemo(() => {
    return [
      <Mark key="mark-extension" />,
      <Emoji key="emoji-extension" />,
      <ExportPDF
        key="ExportPDF"
        modelValue={md}
        height="700px"
        onProgress={onProgress}
        onSuccess={onSuccess}
      />,
    ];
  }, [md]);

  const defFooters = useMemo(() => {
    return [<TimeNow key="time-now" />];
  }, []);

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

      // window.editorInstance = editorRef.current;
    }

    editorRef.current?.on('previewOnly', (v) => {
      if (isMobile()) {
        if (!v) {
          editorRef.current?.togglePreview(false);
        }
      }
    });

    changeLayout();

    window.addEventListener('resize', changeLayout);
  }, [changeLayout, isDebug]);

  useEffect(() => {
    if (localStorage.getItem('debug')) {
      setIsDebug(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
        <meta name="keywords" content={KEYWORDS} />
        <meta name="description" content={DESCRIPTION} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="project-preview">
        <div className="container">
          <MdEditor
            ref={editorRef}
            theme={state.theme}
            previewTheme={state.previewTheme}
            inputBoxWidth={inputBoxWidth}
            codeTheme={state.codeTheme}
            value={md}
            language={lang}
            id={editorId}
            autoDetectCode
            defToolbars={defToolbars}
            onSave={onSave}
            toolbars={ufToolbars}
            onChange={setMd}
            onUploadImg={onUploadImg}
            footers={footers}
            defFooters={defFooters}
            catalogLayout="flat"
          />
          <br />
          <span className="tips-text">
            {tips}
            <a
              href="https://github.com/imzbf/md-editor-extension/tree/develop/packages/rt/components"
              target="_blank"
            >
              components
            </a>
          </span>
        </div>
      </div>
    </>
  );
};

export default HomePage;
