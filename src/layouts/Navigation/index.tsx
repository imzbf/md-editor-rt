import React, { useMemo } from 'react';
import { StateType } from '@/store';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './index.less';

export default () => {
  const lang = useSelector<StateType>((state) => state.lang);
  const dispatch = useDispatch();

  const linkNames = useMemo(() => {
    return lang === 'zh-CN'
      ? {
          home: '首页',
          docs: '文档',
          demo: '示例',
          github: '源码',
          about: '关于',
          lang: 'English',
          langIcon: '#icon-d-en',
          to2: '升级至2.x'
        }
      : {
          home: 'Home',
          docs: 'Docs',
          demo: 'Demo',
          github: 'Github',
          about: 'About',
          lang: '中文',
          langIcon: '#icon-d-cn',
          to2: 'Upgrade 2.x'
        };
  }, [lang]);

  return (
    <ul className="nav-list">
      <li className="nav-item">
        <Link to="/md-editor-rt">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-d-online"></use>
          </svg>
          {linkNames.home}
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/md-editor-rt/docs">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-d-docs"></use>
          </svg>
          {linkNames.docs}
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/md-editor-rt/demo">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-d-demo"></use>
          </svg>
          {linkNames.demo}
        </Link>
      </li>
      <li className="nav-item">
        <a href="https://github.com/imzbf/md-editor-rt" target="_blank">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-d-github"></use>
          </svg>
          {linkNames.github}
        </a>
      </li>
      <li className="nav-item">
        <Link to="/md-editor-rt/about">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-d-about"></use>
          </svg>
          {linkNames.about}
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/md-editor-rt/contrast">
          <svg className="icon" aria-hidden="true">
            <use xlinkHref="#icon-d-v"></use>
          </svg>
          {linkNames.to2}
        </Link>
      </li>
      <li
        className="nav-item"
        onClick={() => {
          dispatch({
            type: 'changeLang'
          });
        }}
      >
        <svg className="icon" aria-hidden="true">
          <use xlinkHref={linkNames.langIcon}></use>
        </svg>
        {linkNames.lang}
      </li>
    </ul>
  );
};
