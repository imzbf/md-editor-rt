import { useContext, useMemo } from 'react';
import { prefix } from '~/config';
import Checkbox from '~/components/Checkbox';
import { EditorContext } from '~/context';

interface ScrollAutoProps {
  scrollAuto: boolean;
  onScrollAutoChange: (v: boolean) => void;
}

const ScrollAuto = (props: ScrollAutoProps) => {
  const { usedLanguageText } = useContext(EditorContext);

  return useMemo(() => {
    return (
      <div className={`${prefix}-footer-item`}>
        <label
          className={`${prefix}-footer-label`}
          onClick={() => {
            props.onScrollAutoChange(!props.scrollAuto);
          }}
        >
          {usedLanguageText.footer?.scrollAuto}
        </label>
        <Checkbox checked={props.scrollAuto} onChange={props.onScrollAutoChange} />
      </div>
    );
  }, [usedLanguageText.footer?.scrollAuto, props]);
};

export default ScrollAuto;
