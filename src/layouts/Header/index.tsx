import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { StateType } from '@/store';
import IzDropdown from '@/components/Dropdown';
import Navigation from '../Navigation';
import { version } from '../../../package.json';
import './index.less';

export default () => {
  const state = useSelector<StateType>((state) => state) as StateType;
  const dispatch = useDispatch();

  const [data] = useState({
    previewThemes: ['default', 'github', 'vuepress', 'mk-cute', 'smart-blue', 'cyanosis'],
    codeThemes: [
      'atom',
      'a11y',
      'github',
      'gradient',
      'kimbie',
      'paraiso',
      'qtcreator',
      'stackoverflow'
    ]
  });

  const texts = useMemo(() => {
    return state.lang === 'zh-CN'
      ? {
          desc: 'Markdown编辑器React版本，使用jsx和typescript语法开发，支持切换主题、prettier美化文本等。',
          defaultTheme: '默认模式',
          darkTheme: '暗黑模式',
          previewBtn: '预览主题',
          codeBtn: '代码主题'
        }
      : {
          desc: 'Markdown Editor for React, developed in jsx and typescript, support different themes、beautify content by prettier.',
          defaultTheme: 'Default Theme',
          darkTheme: 'Dark Theme',
          previewBtn: 'Preview Style',
          codeBtn: 'Code Style'
        };
  }, [state.lang]);

  return (
    <header className="page-header">
      <section className="container">
        <h1 className="project-name">
          md-editor-rt<sup>@{version}</sup>
        </h1>
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
          <IzDropdown
            content={
              <IzDropdown.IzDropdownMenu>
                <>
                  {data.previewThemes.map((item) => {
                    return (
                      <IzDropdown.IzDropdownMenuItem
                        onClick={() => {
                          dispatch({
                            type: 'changePreviewTheme',
                            value: item
                          });
                        }}
                        key={`preview-theme-${item}`}
                      >
                        {item}
                      </IzDropdown.IzDropdownMenuItem>
                    );
                  })}
                </>
              </IzDropdown.IzDropdownMenu>
            }
          >
            <button className="btn btn-header">{texts.previewBtn}</button>
          </IzDropdown>
          <IzDropdown
            content={
              <IzDropdown.IzDropdownMenu>
                <>
                  {data.codeThemes.map((item) => {
                    return (
                      <IzDropdown.IzDropdownMenuItem
                        onClick={() => {
                          dispatch({
                            type: 'changeCodeTheme',
                            value: item
                          });
                        }}
                        key={`code-theme-${item}`}
                      >
                        {item}
                      </IzDropdown.IzDropdownMenuItem>
                    );
                  })}
                </>
              </IzDropdown.IzDropdownMenu>
            }
          >
            <button className="btn btn-header">{texts.codeBtn}</button>
          </IzDropdown>
        </p>
      </section>
    </header>
  );
};
