import { CompletionSource } from '@codemirror/autocomplete';
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import Icon from '~/components/Icon';

import {
  MdEditor,
  DropdownToolbar,
  ModalToolbar,
  MdCatalog,
  ExposeParam,
  NormalFooterToolbar,
  MdHeadingId,
  ToolbarNames
} from '~~/index';

import { Theme } from '../App';
import mdText from '../data.md';

import './index.less';
import Normal from './Normal';

const SAVE_KEY = 'XHMPGLJIZTDB';
const INPUT_BOX_WITDH = 'tcxll8alg5jx52hw';

interface PreviewProp {
  theme: Theme;
  previewTheme: string;
  codeTheme: string;
  lang: 'zh-CN' | 'en-US';
}

const mdHeadingId: MdHeadingId = ({ index }) => {
  return `heading-${index}`;
};

const DEFAULT_TOOLBARS = [
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
  '-',
  'revoke',
  'next',
  'save',
  0,
  1,
  2,
  '=',
  'prettier',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog',
  'github'
] as unknown as ToolbarNames[];

export default ({ theme, previewTheme, codeTheme, lang }: PreviewProp) => {
  const editorRef = useRef<ExposeParam>(null);

  const [md, setMd] = useState<{
    text: string;
    text2: string;
    visible: boolean;
    modalVisible: boolean;
    isFullscreen: boolean;
    inputBoxWitdh?: string;
    disabled?: boolean;
    floatingToolbars: ToolbarNames[];
  }>(() => {
    return {
      text: localStorage.getItem(SAVE_KEY) || mdText,
      text2: 'Hello world',
      visible: false,
      modalVisible: false,
      isFullscreen: false,
      inputBoxWitdh: localStorage.getItem(INPUT_BOX_WITDH) ?? undefined,
      disabled: false,
      floatingToolbars: ['bold', 'underline', 'italic', 'strikeThrough']
    };
  });

  // 自动保存
  const taskId = useRef(-1);
  useEffect(() => {
    clearInterval(taskId.current);
    taskId.current = window.setTimeout(() => {
      localStorage.setItem(SAVE_KEY, md.text);
    }, 2_000);

    return () => {
      clearInterval(taskId.current);
    };
  }, [md.text]);
  // -----end-----

  const [defVisible, setDefVisible] = useState(false);

  const [completions, setCompletions] = useState<Array<CompletionSource>>([]);

  const completionOption = useCallback<CompletionSource>((context) => {
    const word = context.matchBefore(/^>\s*/);

    if (word === null || (word.from == word.to && context.explicit)) {
      return null;
    }

    return {
      from: word.from,
      options: [
        {
          label: '> ',
          type: 'text'
        }
      ]
    } as any;
  }, []);

  const COMPLETIONS_ARRAY = useMemo(() => [completionOption], [completionOption]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setCompletions(COMPLETIONS_ARRAY);
    }, 5000);

    return () => {
      clearTimeout(id);
    };
  }, [COMPLETIONS_ARRAY]);

  const strikeIcon = useMemo(() => <Icon name="strike-through" />, []);
  const dropdownOverlay = useMemo(() => <div>下拉内容</div>, []);

  const DEFAULT_FOOTERS = useMemo(
    () => ['markdownTotal', '=', 0, 'scrollSwitch'] as unknown as any[],
    []
  );
  const DEF_FOOTERS_NODES = useMemo(
    () => [<NormalFooterToolbar key="NormalFooterToolbar">^_^</NormalFooterToolbar>],
    []
  );

  const SINGLE_BOLD = useMemo(() => ['bold'] as ToolbarNames[], []);

  const handleDrop = useCallback((e: DragEvent) => {
    e.stopPropagation();

    void (async () => {
      const form = new FormData();
      const file = e.dataTransfer?.files[0];
      if (file) {
        form.append('file', file);

        try {
          const res = await axios.post('/api/img/upload', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          editorRef.current?.insert(() => {
            return {
              targetValue: `![](${res.data.url})`
            };
          });
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      } else {
        console.warn('No file found in drop event.');
      }
    })();
  }, []);

  const handleInputBoxWidthChange = useCallback((w: string) => {
    setMd((prev) => ({
      ...prev,
      inputBoxWitdh: w
    }));
    localStorage.setItem(INPUT_BOX_WITDH, w);
  }, []);

  const handleSave = useCallback((v: string, h: Promise<any>) => {
    console.log('onSave');
    void h.then((html) => {
      console.log('onSaveAsync', html);
    });
    localStorage.setItem(SAVE_KEY, v);
  }, []);

  const handleChange = useCallback((value: string) => {
    setMd((prev) => ({
      ...prev,
      text: value
    }));
  }, []);

  const handleUploadImg = useCallback((files: File[], callback: (arr: any[]) => void) => {
    void (async () => {
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
              .then((res) => rev(res))
              .catch((error) =>
                rej(error instanceof Error ? error : new Error(String(error)))
              );
          });
        })
      );

      callback(
        res.map((item: any) => ({
          url: item.data.url,
          alt: 'alt',
          title: 'title'
        }))
      );
    })();
  }, []);

  const formatCopiedTextCb = useCallback((text: string) => {
    return `${text} \nfrom @imzbf`;
  }, []);

  useEffect(() => {
    editorRef.current?.on('preview', (status) => {
      console.log('preview', status);
    });

    editorRef.current?.on('previewOnly', (status) => {
      console.log('previewOnly', status);
    });

    editorRef.current?.on('htmlPreview', (status) => {
      console.log('htmlPreview', status);
    });

    editorRef.current?.on('pageFullscreen', (status) => {
      console.log('pageFullscreen', status);
    });

    editorRef.current?.on('fullscreen', (status) => {
      console.log('fullscreen', status);
    });

    editorRef.current?.on('catalog', (status) => {
      console.log('catalog', status);
    });

    editorRef.current?.domEventHandlers({
      compositionstart: () => {
        console.log('compositionstart');
      }
    });
  }, []);

  const defToolbars = useMemo(() => {
    return [
      <Normal key="ddd1" />,
      <DropdownToolbar
        visible={defVisible}
        onChange={setDefVisible}
        overlay={dropdownOverlay}
        key="dddd3"
      >
        {strikeIcon}
      </DropdownToolbar>,
      <ModalToolbar
        key="ddd-modal"
        title="弹窗扩展"
        modalTitle="外置弹窗"
        showAdjust
        visible={md.modalVisible}
        isFullscreen={md.isFullscreen}
        onAdjust={(isFullscreen) => {
          setMd((prev) => ({
            ...prev,
            isFullscreen
          }));
        }}
        trigger={strikeIcon}
        onClick={() => {
          setMd((prev) => ({
            ...prev,
            modalVisible: true
          }));
        }}
        onClose={() => {
          setMd((prev) => ({
            ...prev,
            modalVisible: false
          }));
        }}
      >
        <div
          style={{
            width: '500px',
            height: '300px'
          }}
        ></div>
      </ModalToolbar>
    ];
  }, [defVisible, md.modalVisible, md.isFullscreen, strikeIcon, dropdownOverlay]);

  return (
    <div className="project-preview">
      <div
        style={{
          width: '200px',
          paddingBlock: '10px',
          paddingInline: '10px',
          border: '1px solid #666',
          position: 'fixed',
          insetInlineEnd: '10px',
          insetBlockStart: '170px'
        }}
      >
        <MdCatalog
          theme={theme}
          editorId="md-prev"
          mdHeadingId={mdHeadingId}
          // catalogMaxDepth={2}
        />
      </div>
      <button
        style={{
          position: 'absolute',
          insetBlockStart: '10px',
          insetInlineStart: '10px',
          zIndex: 1000000
        }}
        onClick={() => {
          // editorRef.current?.toggleFullscreen();
          // editorRef.current?.togglePageFullscreen();
          // editorRef.current?.toggleCatalog();
          // editorRef.current?.togglePreviewOnly();
          // editorRef.current?.toggleHtmlPreview();
          // editorRef.current?.togglePreview();
          // editorRef.current?.triggerSave();
          // editorRef.current?.insert((selectedText) => {
          //   return {
          //     targetValue: `@${selectedText}@`,
          //     select: false,
          //     deviationStart: 0,
          //     deviationEnd: 0
          //   };
          // });
          // editorRef.current?.rerender();
          // console.log(editorRef.current?.getSelectedText());
          // editorRef.current?.resetHistory();
          // editorRef.current?.focus({
          //   rangeAnchor: 1000,
          //   rangeHead: 1001,
          //   cursorPos: 1003
          // });
          // editorRef.current?.execCommand('katexBlock');
          // setMd((prev) => {
          //   return {
          //     ...prev,
          //     disabled: !prev.disabled
          //   };
          // });

          setMd((prev) => {
            return {
              ...prev,
              floatingToolbars: SINGLE_BOLD
            };
          });
        }}
      >
        1
      </button>
      <div className="container">
        <MdEditor
          id="md-prev"
          // catalogMaxDepth={2}
          catalogLayout="flat"
          completions={completions}
          ref={editorRef}
          theme={theme}
          language={lang}
          previewTheme={previewTheme}
          codeTheme={codeTheme}
          value={md.text}
          // pageFullscreen
          // preview={false}
          // htmlPreview
          // toolbarsExclude={['github']}
          // noPrettier
          // tabWidth={4}
          // showCodeRowNumber
          // tableShape={[10, 10]}
          // noMermaid
          placeholder="placeholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholderplaceholder"
          // noKatex
          mdHeadingId={mdHeadingId}
          // sanitize={(h) => `<a href="#">aaa</a>${h}`}
          // scrollAuto={false}
          // codeStyleReverse={false}
          // codeStyleReverseList={['mk-cute']}
          // autoFocus
          disabled={md.disabled}
          // readOnly={true}
          // maxLength={10}
          // noHighlight
          // autoDetectCode
          // onHtmlChanged={(html: string) => {
          //   console.log(html);
          // }}
          // onBlur={console.log}
          // onFocus={console.log}
          // showToolbarName
          // onInput={console.log}
          // onError={console.log}
          // codeFoldable={false}
          // autoFoldThreshold={2}
          // transformImgUrl={(t) => {
          //   console.log(t);

          //   return Promise.resolve(
          //     'https://imzbf.github.io/md-editor-v3/imgs/preview-light.png'
          //   );
          // }}
          // noImgZoomIn
          // customIcon={
          //   {
          // bold: {
          //   component: 'A',
          //   props: {}
          // },
          // copy: StrIcon('copy', {}) // '<i class="fa fa-car"></i>',
          // preview: {
          //   component: '<i class="fa fa-car"></i>',
          //   props: {
          //     name: 'copy'
          //   }
          // },
          // github: {
          //   component: Icon,
          //   props: {
          //     name: 'italic'
          //   }
          // }
          // }
          // }
          inputBoxWidth={md.inputBoxWitdh}
          onInputBoxWidthChange={handleInputBoxWidthChange}
          onDrop={handleDrop}
          floatingToolbars={md.floatingToolbars}
          toolbars={DEFAULT_TOOLBARS}
          defToolbars={defToolbars}
          onSave={handleSave}
          onChange={handleChange}
          onUploadImg={handleUploadImg}
          formatCopiedText={formatCopiedTextCb}
          footers={DEFAULT_FOOTERS}
          defFooters={DEF_FOOTERS_NODES}
        />
        <br />
        {/* <MdEditor
          theme={theme}
          previewTheme={previewTheme}
          codeTheme={codeTheme}
          modelValue={md.text2}
          editorId="md-editor-preview-2"
          onChange={(value) => {
            setMd({
              ...md,
              text2: value
            });
          }}
        /> */}
        <br />
        <span className="tips-text">
          tips：本页上方的编辑器有localstorage保存功能，可手动点击保存触发，每次操作后两秒会自己保存一次，可用于一些文档的编辑。下方的文档内容也是使用该编辑器完成~
        </span>
      </div>
    </div>
  );
};
