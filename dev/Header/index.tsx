import React from 'react';
import { Theme } from '../App';
import './index.less';

interface HeaderProp {
  theme: Theme;
  onChange: (v: Theme) => void;
  onPreviewChange: (v: string) => void;
  onCodeThemeChange: (v: string) => void;
  onLangChange: (lang: 'zh-CN' | 'en-US') => void;
}

export default (props: HeaderProp) => (
  <header className="page-header">
    <section className="container">
      <p className="header-actions">
        <button className="btn btn-header" onClick={() => props.onChange('light')}>
          亮模式
        </button>
        <button className="btn btn-header" onClick={() => props.onChange('dark')}>
          暗模式
        </button>
        <button className="btn btn-header" onClick={() => props.onLangChange('en-US')}>
          英文
        </button>
        <button className="btn btn-header" onClick={() => props.onLangChange('zh-CN')}>
          中文
        </button>
      </p>
      <p className="header-actions">
        <button
          className="btn btn-header"
          onClick={() => props.onPreviewChange('default')}
        >
          default
        </button>
        <button
          className="btn btn-header"
          onClick={() => props.onPreviewChange('cyanosis')}
        >
          cyanosis
        </button>
        <button
          className="btn btn-header"
          onClick={() => props.onPreviewChange('github')}
        >
          github
        </button>
        <button
          className="btn btn-header"
          onClick={() => props.onPreviewChange('mk-cute')}
        >
          mk-cute
        </button>
        <button
          className="btn btn-header"
          onClick={() => props.onPreviewChange('smart-blue')}
        >
          smart-blue
        </button>
        <button
          className="btn btn-header"
          onClick={() => props.onPreviewChange('vuepress')}
        >
          vuepress
        </button>
      </p>
      <p className="header-actions">
        {[
          'a11y',
          'atom',
          'github',
          'gradient',
          'kimbie',
          'paraiso',
          'qtcreator',
          'stackoverflow'
        ].map((item) => {
          return (
            <button
              className="btn btn-header"
              onClick={() => props.onCodeThemeChange(item)}
              key={item}
            >
              {item}
            </button>
          );
        })}
      </p>
    </section>
  </header>
);
