import React, { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/store';
import IzDropdown from '@/components/Dropdown';
import IzDrawer from '@/components/Drawer';

import Navigation from '../Navigation';
import pack from '../../../package.json';
import {
  changeCodeTheme,
  changePreviewTheme,
  changeTheme,
  setAll,
} from '@/store';
import { useLang } from '@/hooks/router';
import { STORAGED_STORE_KEY } from '@/config';

const Header = () => {
  const lang = useLang();
  const dispatch = useAppDispatch();

  const [data] = useState({
    previewThemes: [
      'default',
      'github',
      'vuepress',
      'mk-cute',
      'smart-blue',
      'cyanosis',
      'arknights',
    ],
    codeThemes: [
      'atom',
      'a11y',
      'github',
      'gradient',
      'kimbie',
      'paraiso',
      'qtcreator',
      'stackoverflow',
    ],
  });

  const texts = useMemo(() => {
    return lang === 'zh-CN'
      ? {
          desc: 'Markdown编辑器React版本，使用jsx和typescript语法开发，支持切换主题、prettier美化文本等。',
          defaultTheme: '默认模式',
          darkTheme: '暗黑模式',
          previewBtn: '预览主题',
          codeBtn: '代码主题',
        }
      : {
          desc: 'Markdown Editor for React, developed in jsx and typescript, support different themes、beautify content by prettier.',
          defaultTheme: 'Default Theme',
          darkTheme: 'Dark Theme',
          previewBtn: 'Preview Style',
          codeBtn: 'Code Style',
        };
  }, [lang]);

  const theme = useAppSelector((state) => state.setting.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.className = 'theme-dark';
    } else {
      document.documentElement.className = '';
    }
  }, [theme]);

  useEffect(() => {
    const storedState = localStorage.getItem(STORAGED_STORE_KEY);
    if (storedState) {
      try {
        const parsedState = JSON.parse(storedState);
        dispatch(setAll(parsedState));
      } catch (error) {
        console.error('Failed to parse stored state', error);
      }
    }
  }, [dispatch]);

  return (
    <header className="page-header">
      <section className="container">
        <h1 className="project-name">
          md-editor-rt
          <sup>@{pack.dependencies['md-editor-rt'].replace('^', '')}</sup>
        </h1>
        <p className="project-desc">{texts.desc}</p>

        <div className="pc">
          <Navigation />
          <p className="header-actions">
            <button
              className="btn btn-header"
              onClick={() => dispatch(changeTheme('light'))}
            >
              {texts.defaultTheme}
            </button>
            <button
              className="btn btn-header"
              onClick={() => dispatch(changeTheme('dark'))}
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
                            dispatch(changePreviewTheme(item));
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
                            dispatch(changeCodeTheme(item));
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
        </div>

        <div className="mb">
          <IzDrawer
            content={
              <>
                <Navigation />

                <div className="header-hr" />

                <p className="header-actions">
                  <button
                    className="btn btn-header"
                    onClick={() => dispatch(changeTheme('light'))}
                  >
                    {texts.defaultTheme}
                  </button>
                  <button
                    className="btn btn-header"
                    onClick={() => dispatch(changeTheme('dark'))}
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
                                  dispatch(changePreviewTheme(item));
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
                    <button className="btn btn-header">
                      {texts.previewBtn}
                    </button>
                  </IzDropdown>
                  <IzDropdown
                    content={
                      <IzDropdown.IzDropdownMenu>
                        <>
                          {data.codeThemes.map((item) => {
                            return (
                              <IzDropdown.IzDropdownMenuItem
                                onClick={() => {
                                  dispatch(changeCodeTheme(item));
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
              </>
            }
          >
            <svg className="icon m-menu-trigger" aria-hidden="true">
              <use xlinkHref="#med-icon-drawer"></use>
            </svg>
          </IzDrawer>
        </div>
      </section>
    </header>
  );
};

export default Header;
