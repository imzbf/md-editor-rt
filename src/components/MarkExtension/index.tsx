import React from 'react';
import MdEditor, { InsertContentGenerator } from 'md-editor-rt';

const NormalToolbar = MdEditor.NormalToolbar;

interface MarkExtensionProp {
  onInsert: (generator: InsertContentGenerator) => void;
}

const MarkExtension = (props: MarkExtensionProp) => {
  const markHandler = () => {
    const generator: InsertContentGenerator = (selectedText) => {
      return {
        targetValue: `@${selectedText}@`,
        select: true,
        deviationStart: 0,
        deviationEnd: 0
      };
    };

    props.onInsert(generator);
  };

  return (
    <NormalToolbar
      title="mark"
      onClick={markHandler}
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-mark"></use>
        </svg>
      }
    ></NormalToolbar>
  );
};

export default MarkExtension;
