import React, { useEffect } from 'react';
import classNames from 'classnames';
import Header from './layouts/Header';

import { Route, Routes } from 'react-router';
import Preview from './pages/Preview';
import Doc from './pages/Doc';
import Demo from './pages/Demo';
import About from './pages/About';
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

  return (
    <div className={classNames('docs-page', theme === 'dark' && 'theme-dark')}>
      <Header />
      <Routes>
        <Route path="/" element={<Preview />} />
        <Route path="/docs" element={<Doc />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <BackTop>
        <span>UP</span>
      </BackTop>
    </div>
  );
}

export default App;
