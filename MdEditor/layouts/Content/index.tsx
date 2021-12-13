import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import { prefix } from '../../config';
import { EditorContext, SettingType, MarkedHeading, HeadList } from '../../Editor';
import { scrollAuto, generateCodeRowNumber } from '../../utils';
import { useAutoGenrator, useHistory, useMarked } from './hooks';
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
}>;

let clearScrollAuto = () => {};

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

  const [highlightInited, setHighlightInited] = useState<boolean>(hljs !== null);

  // 输入框
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // 输入框选中的内容
  const selectedText = useRef('');
  // 预览框
  const previewRef = useRef<HTMLDivElement>(null);
  // html代码预览框
  const htmlRef = useRef<HTMLDivElement>(null);
  const headstemp: HeadList[] = [];
  // const [headstemp, setHeadStemp] = useState<HeadList[]>([]);

  const heading: MarkedHeading = (...headProps) => {
    const [, level, raw] = headProps;
    // setHeadStemp((_headstemp) => [..._headstemp, { text: raw, level }]);
    headstemp.push({ text: raw, level });

    return props.markedHeading(...headProps);
  };

  console.log(headstemp);

  const marked = useMarked(heading);

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
    return marked(props.value);
  }, [props.value, highlightInited]);

  useEffect(() => {
    // 变化时调用变化事件
    onHtmlChanged(html);

    // 传递标题
    onGetCatalog(headstemp);

    // 生成目录
    bus.emit(editorId, 'catalogChanged', headstemp);

    // 更新完毕后判断是否需要重新绑定滚动事件
    if (props.setting.preview && !previewOnly) {
      setTimeout(() => {
        clearScrollAuto = scrollAuto(
          textAreaRef.current as HTMLElement,
          (previewRef.current as HTMLElement) || htmlRef.current
        );
      }, 0);
    }

    // 重新设置复制按钮
    initCopyEntry();
  }, [html]);
  // ---end---

  useEffect(() => {
    // 分栏发生变化时，显示分栏时注册同步滚动，隐藏是清除同步滚动
    if (props.setting.preview && !previewOnly) {
      // 需要等到页面挂载完成后再注册，否则不能正确获取到预览dom
      clearScrollAuto = scrollAuto(
        textAreaRef.current as HTMLElement,
        (previewRef.current as HTMLElement) || htmlRef.current
      );
    } else {
      clearScrollAuto();
    }
  }, [props.setting.preview]);

  useHistory(props, textAreaRef);

  useAutoGenrator(props, textAreaRef);

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
            />
          </div>
        )}
        {props.setting.preview && (
          <div
            ref={previewRef}
            id={`${prefix}-preview`}
            className={classNames(
              `${prefix}-preview`,
              `${previewTheme}-theme`,
              showCodeRowNumber && `${prefix}-scrn`
            )}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
        {props.setting.htmlPreview && (
          <div ref={htmlRef} className={`${prefix}-html`}>
            {html}
          </div>
        )}
      </div>
    </>
  );
};

export default Content;
