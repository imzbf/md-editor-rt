import React, { useEffect, lazy, Suspense } from 'react';
import Header from './layouts/Header';
import BackTop from '@/components/BackTop';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
const Preview = lazy(() => import('./pages/Preview'));
const Doc = lazy(() => import('./pages/Doc'));
const Demo = lazy(() => import('./pages/Demo'));
const About = lazy(() => import('./pages/About'));
const Grammar = lazy(() => import('./pages/Grammar'));
import Contrast from './pages/Contrast';

import { StateType } from './store';
import { useSelector } from 'react-redux';
import Loading from '@/layouts/Loading';

export type Theme = 'dark' | 'light';

import './app.less';

function App() {
  const { theme, lang } = useSelector<StateType, StateType>((state) => state);

  const nav = useNavigate();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.className = 'theme-dark';
    } else {
      document.documentElement.className = '';
    }
  }, [theme]);

  useEffect(() => {
    nav(
      location.pathname.replace(/(\/md-editor-rt\/)[a-zA-Z-]+/, `/md-editor-rt/${lang}`) +
        location.hash
    );
  }, [lang]);

  return (
    <div className="docs-page">
      <Header />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/md-editor-rt/:l/index" element={<Preview />} />
          <Route path="/md-editor-rt/:l/docs" element={<Doc />} />
          <Route path="/md-editor-rt/:l/demo" element={<Demo />} />
          <Route path="/md-editor-rt/:l/about" element={<About />} />
          <Route path="/md-editor-rt/:l/grammar" element={<Grammar />} />
          <Route path="/md-editor-rt/:l/contrast" element={<Contrast />} />
          <Route path="*" element={<Navigate to="/md-editor-rt/en-US/index" replace />} />
        </Routes>
      </Suspense>
      <BackTop />
    </div>
  );
}

export default App;
