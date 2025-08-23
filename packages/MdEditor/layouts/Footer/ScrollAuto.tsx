import { useContext, useMemo } from 'react';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

import Checkbox from '~/components/Checkbox';

interface ScrollAutoProps {
  scrollAuto: boolean;
  onScrollAutoChange: (v: boolean) => void;
}

const ScrollAuto = (props: ScrollAutoProps) => {
  const { usedLanguageText, disabled } = useContext(EditorContext);

  return useMemo(() => {
    return (
      <div
        className={classnames([
          `${prefix}-footer-item`,
          disabled && `${prefix}-disabled`
        ])}
      >
        <label
          className={`${prefix}-footer-label`}
          onClick={() => {
            if (disabled) return;
            props.onScrollAutoChange(!props.scrollAuto);
          }}
        >
          {usedLanguageText.footer?.scrollAuto}
        </label>
        <Checkbox
          disabled={disabled}
          checked={props.scrollAuto}
          onChange={props.onScrollAutoChange}
        />
      </div>
    );
  }, [usedLanguageText.footer?.scrollAuto, disabled, props]);
};

export default ScrollAuto;
