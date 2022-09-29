import React, { useContext, useMemo } from 'react';
import { prefix } from '../../config';
import { EditorContext } from '../../Editor';

export default ({ modelValue }: { modelValue: string }) => {
  const { usedLanguageText } = useContext(EditorContext);

  const _MarkdownTotal = useMemo(() => {
    return (
      <div className={`${prefix}-footer-item`}>
        <label className={`${prefix}-footer-label`}>
          {`${usedLanguageText.footer?.markdownTotal}:`}
        </label>
        <span>{modelValue.length || 0}</span>
      </div>
    );
  }, [usedLanguageText, modelValue]);

  return _MarkdownTotal;
};
