import React, { useState } from 'react';
import { MdEditor, StrIcon } from '~~/index';
import data from './data.md';

// eslint-disable-next-line react-refresh/only-export-components
export default () => {
  const [text, setText] = useState(data);

  return (
    <div className="container">
      <MdEditor
        modelValue={text}
        onChange={setText}
        scrollAuto={false}
        customIcon={{
          copy: StrIcon('copy', {}) // '<i class="fa fa-car"></i>',
        }}
        // onDrop={(e) => {
        //   console.log('ee', e);
        // }}
      />
    </div>
  );
};
