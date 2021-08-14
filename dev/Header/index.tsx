import React from 'react';
import { Theme } from '../App';
import './index.less';

interface HeaderProp {
  theme: Theme;
  onChange: (v: Theme) => void;
}

export default (props: HeaderProp) => (
  <header className="page-header">
    <section className="container">
      <h1 className="project-name">md-editor-rt</h1>
      <p className="project-desc">
        Markdown编辑器，React版本，支持切换主题、Prettier美化文本等，支持SSR，在NextJs中使用。
      </p>
      <p className="header-actions">
        <button className="btn btn-header">
          <a
            href="https://github.com/imzbf/md-editor-rt"
            target="_blank"
            title="md-editor-rt"
          >
            GitHub源码
          </a>
        </button>
        <button className="btn btn-header" onClick={() => props.onChange('light')}>
          默认模式
        </button>
        <button className="btn btn-header" onClick={() => props.onChange('dark')}>
          暗黑模式
        </button>
      </p>
    </section>
  </header>
);
