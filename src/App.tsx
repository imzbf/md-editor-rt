import React, { useEffect, lazy, Suspense } from 'react';
import Header from './layouts/Header';
import BackTop from '@/components/BackTop';
import { Route, Routes } from 'react-router-dom';
const Preview = lazy(() => import('./pages/Preview'));
const Doc = lazy(() => import('./pages/Doc'));
const Demo = lazy(() => import('./pages/Demo'));
const About = lazy(() => import('./pages/About'));
const Contrast = lazy(() => import('./pages/Contrast'));
import { StateType } from './store';
import { useSelector } from 'react-redux';
import Loading from '@/layouts/Loading';

export type Theme = 'dark' | 'light';

function App() {
  const theme = useSelector<StateType>((state) => state.theme);

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
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/md-editor-rt" element={<Preview />} />
          <Route path="/md-editor-rt/docs" element={<Doc />} />
          <Route path="/md-editor-rt/demo" element={<Demo />} />
          <Route path="/md-editor-rt/about" element={<About />} />
          <Route path="/md-editor-rt/contrast" element={<Contrast />} />
        </Routes>
      </Suspense>
      <BackTop />
    </div>
  );
}

export default App;
