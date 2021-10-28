import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import marked from 'marked';
import copy from 'copy-to-clipboard';
import { prefix } from '../../config';
import { EditorContext, HeadList, SettingType, MarkedHeading } from '../../Editor';
import bus from '../../utils/event-bus';
import { insert, setPosition, scrollAuto, generateCodeRowNumber } from '../../utils';
import { ToolDirective, directive2flag } from '../../utils/content-help';
import { useHistory } from './hooks';
import classNames from 'classnames';
import { appendHandler } from '../../utils/dom';

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

  // 标题获取
  const headstemp: HeadList[] = [];
  const renderer = new marked.Renderer();
  // 标题重构
  renderer.heading = (...headProps) => {
    const [text, level] = headProps;
    headstemp.push({ text, level });

    return props.markedHeading(...headProps);
  };

  renderer.image = (href, _, desc) => {
    return `<figure><img src="${href}" alt="${desc}"><figcaption>${desc}</figcaption></figure>`;
  };

  marked.setOptions({
    renderer
  });

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

    if (!previewOnly) {
      textAreaRef.current?.addEventListener('select', () => {
        selectedText.current = window.getSelection()?.toString() || '';
      });

      textAreaRef.current?.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          const endPoint = textAreaRef.current?.selectionStart as number;

          // 前半部分
          const prefixStr = textAreaRef.current?.value.substring(0, endPoint);
          // 后半部分
          const subStr = textAreaRef.current?.value.substring(endPoint);
          // 前半部分最后一个换行符位置，用于分割当前行内容
          const lastIndexBR = prefixStr?.lastIndexOf('\n');

          const enterPressRow = prefixStr?.substring(
            (lastIndexBR as number) + 1,
            endPoint
          ) as string;

          // 是列表
          if (/^\d+\.\s|^-\s/.test(enterPressRow)) {
            event.cancelBubble = true;
            event.preventDefault();
            event.stopPropagation();

            // 如果列表当前行没有内容，则清空当前行
            if (/^\d+\.\s+$|^-\s+$/.test(enterPressRow)) {
              const resetPrefixStr = prefixStr?.replace(
                new RegExp(enterPressRow + '$'),
                ''
              );
              onChange((resetPrefixStr as string) + subStr);

              // 手动定位光标到当前位置
              setPosition(
                textAreaRef.current as HTMLTextAreaElement,
                resetPrefixStr?.length
              );
            } else if (/^-\s+.+/.test(enterPressRow)) {
              // 无序列表存在内容
              onChange(insert(textAreaRef.current as HTMLTextAreaElement, `\n- `, {}));
            } else {
              const lastOrderMatch = enterPressRow?.match(/\d+(?=\.)/);

              const nextOrder = (lastOrderMatch && Number(lastOrderMatch[0]) + 1) || 1;
              onChange(
                insert(textAreaRef.current as HTMLTextAreaElement, `\n${nextOrder}. `, {})
              );
            }
          }
        }
      });

      // 注册指令替换内容事件
      bus.on(editorId, {
        name: 'replace',
        callback(direct: ToolDirective, params: any) {
          onChange(
            directive2flag(
              direct,
              selectedText.current,
              textAreaRef.current as HTMLTextAreaElement,
              params
            )
          );
        }
      });
    }

    return () => {
      if (!props.hljs) {
        document.head.removeChild(highlightLink);
        document.head.removeChild(highlightScript);
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

    // 更新完毕后判断是否需要重新绑定滚动事件
    if (props.setting.preview && !previewOnly) {
      clearScrollAuto = scrollAuto(
        textAreaRef.current as HTMLElement,
        (previewRef.current as HTMLElement) || htmlRef.current
      );
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
