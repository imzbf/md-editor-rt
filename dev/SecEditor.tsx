import React, { useState } from 'react';
import { MdEditor, StrIcon } from '~~/index';
import data from './data.md';

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
