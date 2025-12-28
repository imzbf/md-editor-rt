import React, { useState } from 'react';
import { MdEditor, StrIcon } from '~~/index';
import data from './data.md';

export default () => {
  const [text, setText] = useState(data);
  const [visible, setVisible] = useState(false);
  const changeVisible = () => {
    setVisible((prev) => {
      return !prev;
    });
  };

  return (
    <div className="container">
      <div style={{ marginBlock: '1em', marginInline: '0' }}>
        <button onClick={changeVisible}>点击</button>
      </div>

      {visible && (
        <MdEditor
          value={text}
          onChange={setText}
          scrollAuto={false}
          customIcon={{
            copy: StrIcon('copy', {}) // '<i class="fa fa-car"></i>',
          }}
          // onDrop={(e) => {
          //   console.log('ee', e);
          // }}
        />
      )}
    </div>
  );
};
