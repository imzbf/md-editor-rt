import React, { useContext } from 'react';
import { prefix } from '../../config';
import { EditorContext } from '../../Editor';

export default ({ modelValue }: { modelValue: string }) => {
  const { usedLanguageText } = useContext(EditorContext);

  return (
    <div className={`${prefix}-footer-item`}>
      <label className={`${prefix}-footer-label`}>
        {usedLanguageText.footer?.markdownTotal}:
      </label>
      <span>{modelValue.length}</span>
    </div>
  );
};
