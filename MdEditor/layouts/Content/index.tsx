import React, { useEffect, useMemo, useRef, useState } from 'react';
import marked from 'marked';
import copy from 'copy-to-clipboard';
import { prefix } from '../../config';
import { SettingType, StaticTextDefaultValue } from '../../Editor';
import bus from '../../utils/event-bus';
import {
  ToolDirective,
  directive2flag,
  insert,
  setPosition,
  scrollAuto
} from '../../utils';
import { useHistory } from './hooks';

export type EditorContentProp = Readonly<{
  value: string;
  hljs?: Record<string, any> | undefined;
  setting: SettingType;
  editorId: string;
  highlight: { js: string; css: string };
  previewOnly?: boolean;
  ult: StaticTextDefaultValue;
  historyLength?: number;
  onChange?: (v: string) => void;
  onHtmlChanged?: (h: string) => void;
}>;

const Content = (props: EditorContentProp) => {
  // ID
  const {
    editorId,
    highlight,
    previewOnly,
    ult,
    hljs = null,
    onChange = () => {},
    onHtmlChanged = () => {}
  } = props;

  const [highlightInited, setHighlightInited] = useState<boolean>(hljs !== null);

  // 输入框
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // 输入框选中的内容
  const selectedText = useRef('');
  // 预览框
  const previewRef = useRef<HTMLDivElement>(null);
  // html代码预览框
  const htmlRef = useRef<HTMLDivElement>(null);

  if (hljs) {
    // 提供了hljs，在创建阶段即完成设置
    marked.setOptions({
      highlight(code) {
        return hljs.highlightAuto(code).value;
      }
    });
  }

  // 向页面代码块注入复制按钮
  const initCopyEntry = () => {
    document
      .querySelectorAll(`#${editorId} .${prefix}-preview pre`)
      .forEach((pre: Element) => {
        const copyButton = document.createElement('span');
        copyButton.setAttribute('class', 'copy-button');
        copyButton.innerText = ult.copyCode?.text || '复制代码';
        copyButton.addEventListener('click', () => {
          copy((pre.querySelector('code') as HTMLElement).innerText);

          copyButton.innerText = ult.copyCode?.tips || '已复制！';
          setTimeout(() => {
            copyButton.innerText = ult.copyCode?.text || '复制代码';
          }, 1500);
        });
        pre.appendChild(copyButton);
      });
  };

  useEffect(() => {
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
      bus.on({
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
  }, []);

  // ---预览代码---
  const html = useMemo(() => {
    if (highlightInited) {
      return marked(props.value);
    } else {
      return '';
    }
  }, [props.value, highlightInited]);

  let clearScrollAuto = () => {};
  useEffect(() => {
    // 变化时调用变化事件
    onHtmlChanged(html);

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

  const highlightLoad = () => {
    marked.setOptions({
      highlight(code) {
        return window.hljs.highlightAuto(code).value;
      }
    });

    setHighlightInited(true);
  };

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

  useEffect(() => {
    const highlightLink = document.createElement('link');
    highlightLink.rel = 'stylesheet';
    highlightLink.href = highlight.css;

    const highlightScript = document.createElement('script');
    highlightScript.src = highlight.js;
    highlightScript.onload = highlightLoad;

    if (!props.hljs) {
      document.head.appendChild(highlightLink);
      document.body.appendChild(highlightScript);
    }

    return () => {
      if (!props.hljs) {
        document.head.removeChild(highlightLink);
        document.body.removeChild(highlightScript);
      }
    };
  }, []);

  useHistory(props);

  return (
    <>
      <div className={`${prefix}-content`}>
        {!previewOnly && (
          <div className={`${prefix}-input-wrapper`}>
            <textarea
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
            className={`${prefix}-preview`}
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
