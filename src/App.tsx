import React, { useEffect, lazy, Suspense } from 'react';
import Header from './layouts/Header';

import { Route, Routes } from 'react-router-dom';
const Preview = lazy(() => import('./pages/Preview'));
const Doc = lazy(() => import('./pages/Doc'));
const Demo = lazy(() => import('./pages/Demo'));
const About = lazy(() => import('./pages/About'));
import { BackTop } from 'antd';
import { StateType } from './store';
import { useSelector } from 'react-redux';

export type Theme = 'dark' | 'light';

function App() {
  const theme = useSelector<StateType>((state) => state.theme);

  useEffect(() => {
    if (import.meta.env.MODE === 'preview') {
      const hm = document.createElement('script');
      hm.src = 'https://hm.baidu.com/hm.js?1563bc52cb27ffbc7b5b46cdfc327ce0';
      document.head.appendChild(hm);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.className = 'theme-dark';
    } else {
      document.documentElement.className = '';
    }
  }, [theme]);

  return (
    <div className="docs-page">
      <Header />
      <Suspense fallback={<div></div>}>
        <Routes>
          <Route path="/md-editor-rt" element={<Preview />} />
          <Route path="/md-editor-rt/docs" element={<Doc />} />
          <Route path="/md-editor-rt/demo" element={<Demo />} />
          <Route path="/md-editor-rt/about" element={<About />} />
        </Routes>
      </Suspense>
      <BackTop>
        <span>UP</span>
      </BackTop>
    </div>
  );
}

export default App;
