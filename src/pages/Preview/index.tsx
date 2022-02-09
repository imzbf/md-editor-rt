import React, { useEffect, useState } from 'react';
import axios from '@/utils/request';
import Editor from 'md-editor-rt';
import { mdText, mdEnText, emojis } from '../../data';
import MarkExtension from '@/utils/marked-mark';
import './index.less';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

export default () => {
  const [md, setMd] = useState('');

  const state = useSelector((state: any) => state) as StateType;

  useEffect(() => {
    if (state.lang === 'zh-CN') {
      setMd(mdText);
    } else {
      setMd(mdEnText);
    }
  }, [state.lang]);

  const [emojiVisible, setEmojiVisible] = useState(false);

  const markHandler = () => {
    // 获取输入框
    const textarea = document.querySelector('#md-prev-textarea') as HTMLTextAreaElement;
    // 获取选中的内容
    const selection = window.getSelection()?.toString();
    // 获取鼠标位置
    const endPoint = textarea.selectionStart;

    // 生成标记文本
    const markStr = `@${selection}@`;

    // 根据鼠标位置分割旧文本
    // 前半部分
    const prefixStr = textarea.value.substring(0, endPoint);
    // 后半部分
    const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));

    setMd(`${prefixStr}${markStr}${suffixStr}`);

    setTimeout(() => {
      textarea.setSelectionRange(endPoint, markStr.length + endPoint);
      textarea.focus();
    }, 0);
  };

  const emojiHandler = (emoji: string) => {
    // 获取输入框
    const textarea = document.querySelector('#md-prev-textarea') as HTMLTextAreaElement;
    // 获取选中的内容
    const selection = window.getSelection()?.toString();
    // 获取鼠标位置
    const endPoint = textarea.selectionStart;

    // 根据鼠标位置分割旧文本
    // 前半部分
    const prefixStr = textarea.value.substring(0, endPoint);
    // 后半部分
    const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));

    setMd(`${prefixStr}${emoji}${suffixStr}`);

    setTimeout(() => {
      textarea.setSelectionRange(endPoint, endPoint + 1);
      textarea.focus();
    }, 0);
  };

  return (
    <div className="project-preview">
      <div className="container">
        <Editor
          theme={state.theme}
          previewTheme={state.previewTheme}
          modelValue={md}
          language={state.lang}
          editorId="md-prev"
          defToolbars={[
            <Editor.NormalToolbar
              title="标记"
              trigger={
                <svg className="md-icon" aria-hidden="true">
                  <use xlinkHref="#icon-mark"></use>
                </svg>
              }
              onClick={markHandler}
              key="mark-toolbar"
            ></Editor.NormalToolbar>,
            <Editor.DropdownToolbar
              visible={emojiVisible}
              onChange={setEmojiVisible}
              overlay={
                <>
                  <div className="emoji-container">
                    <ol className="emojis">
                      {emojis.map((emoji, index) => (
                        <li
                          key={`emoji-${index}`}
                          onClick={() => {
                            emojiHandler(emoji);
                          }}
                        >
                          {emoji}
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              }
              trigger={
                <svg className="md-icon" aria-hidden="true">
                  <use xlinkHref="#icon-emoji"></use>
                </svg>
              }
              key="emoji-toolbar"
            ></Editor.DropdownToolbar>
          ]}
          extensions={[MarkExtension]}
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
            '-',
            'revoke',
            'next',
            'save',
            '=',
            'prettier',
            'pageFullscreen',
            'fullscreen',
            'preview',
            'htmlPreview',
            'catalog',
            'github'
          ]}
          onChange={(value: string) => setMd(value)}
          onUploadImg={async (files: FileList, callback: (urls: string[]) => void) => {
            const res = await Promise.all(
              Array.from(files).map((file) => {
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
        />
        <br />
        <span className="tips-text">
          {state.lang === 'zh-CN'
            ? 'Tips：本页展示编辑器localstorage存储功能已移除！本页面的emoji示例需要自行扩展，请参考示例页面中的内容！'
            : 'Tips: The editor in this page can not save text to localstorage now! The function of inserting emoji on this page needs to be developed by yourself! The example is on the "demo" page.'}
        </span>
      </div>
    </div>
  );
};
