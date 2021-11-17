import classNames from 'classnames';
import React, { useState } from 'react';
import Header from './Header';

import './style.less';
import { Route, Routes } from 'react-router';
import Preview from './pages/Preview';
import Doc from './pages/Doc';
import Demo from './pages/Demo';
import About from './pages/About';

export type Theme = 'dark' | 'light';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <div className={classNames('app', theme === 'dark' && 'theme-dark')}>
      <Header theme={theme} onChange={(v: Theme) => setTheme(v)} />
      <Routes>
        <Route path="/" element={<Preview />} />
        <Route path="/docs" element={<Doc />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
