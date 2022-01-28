import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import { prefix } from '../../config';
import { EditorContext } from '../../Editor';
import { SettingType, MarkedHeading, HeadList } from '../../type';
import { generateCodeRowNumber } from '../../utils';
import {
  useAutoGenrator,
  useHistory,
  useMarked,
  useMermaid,
  useKatex,
  useAutoScroll,
  usePasteUpload
} from './hooks';
import classNames from 'classnames';
import { appendHandler } from '../../utils/dom';
import bus from '../../utils/event-bus';

export type EditorContentProp = Readonly<{
  value: string;
  hljs?: Record<string, any>;
  highlightSet: {
    js: string;
    css: string;
  };
  onChange: (v: string) => void;
  setting: SettingType;
  onHtmlChanged?: (h: string) => void;
  onGetCatalog?: (list: HeadList[]) => void;
  markedHeading: MarkedHeading;
  // mermaid实例
  mermaid?: any;
  // mermaid script链接
  mermaidJs: string;
  // 不使用该功能
  noMermaid?: boolean;
  sanitize: (html: string) => string;
  placeholder: string;
  // katex实例
  katex?: any;
  // katex script链接
  katexJs: string;
  katexCss: string;
  noKatex?: boolean;
  extensions?: Array<any>;
}>;

const Content = (props: EditorContentProp) => {
  // ID
  const {
    hljs = null,
    highlightSet,
    onChange = () => {},
    onHtmlChanged = () => {},
    onGetCatalog = () => {}
  } = props;

  const { editorId, previewOnly, usedLanguageText, previewTheme, showCodeRowNumber } =
    useContext(EditorContext);

  // 当页面已经引入完成对应的库时，通过修改从状态完成marked重新编译
  const [highlightInited, setHighlightInited] = useState<boolean>(!!hljs);

  // 输入框
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // 输入框选中的内容
  const selectedText = useRef('');
  // 预览框
  const previewRef = useRef<HTMLDivElement>(null);
  // html代码预览框
  const htmlRef = useRef<HTMLDivElement>(null);
  // const [heads, setHeads] = useState<HeadList[]>([]);
  const heads = useRef<HeadList[]>([]);

  const heading: MarkedHeading = (...headProps) => {
    const [, level, raw] = headProps;
    // setHeads((_heads) => [..._heads, { text: raw, level }]);
    heads.current.push({ text: raw, level });

    return props.markedHeading(...headProps);
  };

  const marked = useMarked(props, heading);
  const katexInited = useKatex(props, marked);
  const { reRender, mermaidInited } = useMermaid(props);

  // 向页面代码块注入复制按钮
  const initCopyEntry = () => {
    document
      .querySelectorAll(`#${editorId} .${prefix}-preview pre`)
      .forEach((pre: Element) => {
        const copyButton = document.createElement('span');
        copyButton.setAttribute('class', 'copy-button');
        copyButton.innerText = usedLanguageText.copyCode?.text || '复制代码';
        copyButton.addEventListener('click', () => {
          copy((pre.querySelector('code') as HTMLElement).innerText);

          copyButton.innerText = usedLanguageText.copyCode?.tips || '已复制！';
          setTimeout(() => {
            copyButton.innerText = usedLanguageText.copyCode?.text || '复制代码';
          }, 1500);
        });
        pre.appendChild(copyButton);
      });
  };

  const highlightLoad = () => {
    marked.setOptions({
      highlight(code) {
        const codeHtml = window.hljs.highlightAuto(code).value;
        return showCodeRowNumber
          ? generateCodeRowNumber(codeHtml)
          : `<span class="code-block">${codeHtml}</span>`;
      }
    });

    setHighlightInited(true);
  };

  useEffect(() => {
    let highlightLink: HTMLLinkElement;
    let highlightScript: HTMLScriptElement;

    if (props.hljs) {
      // 提供了hljs，在创建阶段即完成设置
      marked.setOptions({
        highlight: (code) => {
          const codeHtml = props.hljs?.highlightAuto(code).value;

          return showCodeRowNumber
            ? generateCodeRowNumber(codeHtml)
            : `<span class="code-block">${codeHtml}</span>`;
        }
      });
    } else {
      highlightLink = document.createElement('link');
      highlightLink.rel = 'stylesheet';
      highlightLink.href = highlightSet.css;
      highlightLink.id = `${prefix}-hlCss`;

      highlightScript = document.createElement('script');
      highlightScript.src = highlightSet.js;
      highlightScript.onload = highlightLoad;
      highlightScript.id = `${prefix}-hljs`;

      appendHandler(highlightLink);
      appendHandler(highlightScript);
    }

    return () => {
      if (!props.hljs) {
        highlightLink.remove();
        highlightScript.remove();
      }
    };
  }, []);

  // ---预览代码---
  const html = useMemo(() => {
    heads.current = [];
    const _html = marked(props.value);

    return props.sanitize(_html);
  }, [props.value, highlightInited, mermaidInited, reRender, katexInited]);

  useEffect(() => {
    // 变化时调用变化事件
    onHtmlChanged(html);

    // 传递标题
    onGetCatalog(heads.current);
    // 生成目录，
    bus.emit(editorId, 'catalogChanged', heads.current);

    // 重新设置复制按钮
    initCopyEntry();

    // 重新构造svg
    // if (!props.noMermaid && window.mermaid) {
    //   window.mermaid.init('.mermaid');
    // }
  }, [html]);
  // ---end---

  useAutoScroll(props, html, textAreaRef, previewRef, htmlRef);

  useHistory(props, textAreaRef);
  useAutoGenrator(props, textAreaRef);

  usePasteUpload(textAreaRef);

  return (
    <>
      <div className={`${prefix}-content`}>
        {!previewOnly && (
          <div className={`${prefix}-input-wrapper`}>
            <textarea
              id={`${editorId}-textarea`}
              ref={textAreaRef}
              value={props.value}
              onInput={(e) => {
                // 先清空保存的选中内容，防止异常现象
                selectedText.current = '';

                // 触发更新
                onChange((e.target as HTMLTextAreaElement).value);
              }}
              className={
                props.setting.preview || props.setting.htmlPreview ? '' : 'textarea-only'
              }
              placeholder={props.placeholder}
            />
          </div>
        )}
        {props.setting.preview && (
          <div
            className={`${prefix}-preview-wrapper`}
            ref={previewRef}
            key="content-preview-wrapper"
          >
            <div
              id={`${prefix}-preview`}
              className={classNames(
                `${prefix}-preview`,
                `${previewTheme}-theme`,
                showCodeRowNumber && `${prefix}-scrn`
              )}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
        {props.setting.htmlPreview && (
          <div
            className={`${prefix}-preview-wrapper`}
            ref={htmlRef}
            key="html-preview-wrapper"
          >
            <div className={`${prefix}-html`}>{html}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default Content;
