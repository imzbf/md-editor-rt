import React, { useState } from 'react';
import Header from './Header';
import Preview from './Preview';
import PreviewOnly from './PreviewOnly';
import './style.less';

export type Theme = 'dark' | 'light';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [previewTheme, setPreviewTheme] = useState<string>('default');
  const [codeTheme, setCodeTheme] = useState<string>('kimbie');
  const [lang, setLang] = useState<'zh-CN' | 'en-US'>('zh-CN');

  return (
    <div className={['app', theme === 'dark' && 'theme-dark'].join(' ')}>
      <Header
        theme={theme}
        onChange={setTheme}
        onPreviewChange={setPreviewTheme}
        onCodeThemeChange={setCodeTheme}
        onLangChange={setLang}
      />
      <div className="page-body">
        <Preview
          lang={lang}
          theme={theme}
          previewTheme={previewTheme}
          codeTheme={codeTheme}
        />
        <PreviewOnly theme={theme} previewTheme={previewTheme} codeTheme={codeTheme} />
      </div>
    </div>
  );
}

export default App;
