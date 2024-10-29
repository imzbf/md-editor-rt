import { useContext, useMemo } from 'react';
import { prefix } from '~/config';
import { EditorContext } from '~/context';

const MarkdownTotal = ({ modelValue }: { modelValue: string }) => {
  const { usedLanguageText } = useContext(EditorContext);

  return useMemo(() => {
    return (
      <div className={`${prefix}-footer-item`}>
        <label className={`${prefix}-footer-label`}>
          {`${usedLanguageText.footer?.markdownTotal}:`}
        </label>
        <span>{modelValue.length || 0}</span>
      </div>
    );
  }, [usedLanguageText, modelValue]);
};

export default MarkdownTotal;
