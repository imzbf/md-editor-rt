import { memo, useContext } from 'react';
import Checkbox from '~/components/Checkbox';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

interface ScrollAutoProps {
  scrollAuto: boolean;
  onScrollAutoChange: (v: boolean) => void;
}

const ScrollAuto = (props: ScrollAutoProps) => {
  const { usedLanguageText, disabled } = useContext(EditorContext);

  return (
    <div
      className={classnames([`${prefix}-footer-item`, disabled && `${prefix}-disabled`])}
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
};

export default memo(ScrollAuto);
