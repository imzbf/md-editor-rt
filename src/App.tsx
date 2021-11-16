import classNames from 'classnames';
import React, { useState } from 'react';
import Header from './Header';
import Preview from './Preview';
import Doc from './Doc';

import './style.less';

export type Theme = 'dark' | 'light';

function App() {
  const [theme, setTheme] = useState<Theme>('light');
  return (
    <div className={classNames('app', theme === 'dark' && 'theme-dark')}>
      <Header theme={theme} onChange={(v: Theme) => setTheme(v)} />
      <div className="page-body">
        <Preview theme={theme} />
        {/* <Doc theme={theme} /> */}
      </div>
    </div>
  );
}

export default App;
