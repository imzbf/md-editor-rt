import React, { useMemo, useState } from 'react';
import { StateType } from '@/store';
import { Dropdown, Menu } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Navigation from '../Navigation';
import './index.less';

export default () => {
  const state = useSelector<StateType>((state) => state) as StateType;
  const dispatch = useDispatch();

  const [previewThemevisible, setPreviewThemevisible] = useState(false);

  const texts = useMemo(() => {
    return state.lang === 'zh-CN'
      ? {
          desc: 'Markdown编辑器React版本，使用jsx和typescript语法开发，支持切换主题、prettier美化文本等。',
          defaultTheme: '默认模式',
          darkTheme: '暗黑模式',
          previewBtn: '切换预览主题',
          previewDefaultTheme: '默认主题',
          previewVuepressTheme: 'Vuepress主题',
          previewGithubTheme: 'Github主题'
        }
      : {
          desc: 'Markdown Editor for React, developed by jsx and typescript, support different themes、beautify content by prettier.',
          defaultTheme: 'Default Theme',
          darkTheme: 'Dark Theme',
          previewBtn: 'Preview Style',
          previewDefaultTheme: 'Default Style',
          previewVuepressTheme: 'Vuepress Style',
          previewGithubTheme: 'Github Style'
        };
  }, [state.lang]);

  return (
    <header className="page-header">
      <section className="container">
        <h1 className="project-name">md-editor-rt</h1>
        <p className="project-desc">{texts.desc}</p>
        <Navigation />
        <p className="header-actions">
          <button
            className="btn btn-header"
            onClick={() =>
              dispatch({
                type: 'changeTheme',
                value: 'light'
              })
            }
          >
            {texts.defaultTheme}
          </button>
          <button
            className="btn btn-header"
            onClick={() =>
              dispatch({
                type: 'changeTheme',
                value: 'dark'
              })
            }
          >
            {texts.darkTheme}
          </button>
          <Dropdown
            placement="bottomCenter"
            getPopupContainer={() => {
              return document.querySelector('.docs-page') as HTMLElement;
            }}
            overlayStyle={{ pointerEvents: 'initial' }}
            overlay={
              <Menu theme={state.theme}>
                <Menu.Item
                  key="changePreviewThemeDefault"
                  onClick={() => {
                    dispatch({
                      type: 'changePreviewTheme',
                      value: 'default'
                    });
                  }}
                >
                  {texts.previewDefaultTheme}
                </Menu.Item>
                <Menu.Item
                  key="changePreviewThemeGithub"
                  onClick={() => {
                    dispatch({
                      type: 'changePreviewTheme',
                      value: 'github'
                    });
                  }}
                >
                  {texts.previewGithubTheme}
                </Menu.Item>
                <Menu.Item
                  key="changePreviewThemeVuepress"
                  onClick={() => {
                    dispatch({
                      type: 'changePreviewTheme',
                      value: 'vuepress'
                    });
                  }}
                >
                  {texts.previewVuepressTheme}
                </Menu.Item>
              </Menu>
            }
            visible={previewThemevisible}
            onVisibleChange={(visible) => {
              setPreviewThemevisible(visible);
            }}
          >
            <button className="btn btn-header">{texts.previewBtn}</button>
          </Dropdown>
        </p>
      </section>
    </header>
  );
};
