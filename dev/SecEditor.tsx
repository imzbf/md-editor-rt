import React, { useState } from 'react';
import { MdEditor } from '~~/index';
import data from './data.md';

export default () => {
  const [text, setText] = useState(data);

  return (
    <div className="container">
      <MdEditor
        modelValue={text}
        onChange={setText}
        scrollAuto={false}
        // onDrop={(e) => {
        //   console.log('ee', e);
        // }}
      />
    </div>
  );
};
