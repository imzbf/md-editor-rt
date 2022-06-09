import React, { useContext, useMemo } from 'react';
import { prefix } from '../../config';
import Checkbox from '../../components/Checkbox';
import { EditorContext } from '../../Editor';

interface ScrollAutoProp {
  scrollAuto: boolean;
  onScrollAutoChange: (v: boolean) => void;
}

export default (props: ScrollAutoProp) => {
  const { usedLanguageText } = useContext(EditorContext);

  const _ScrollAuto = useMemo(() => {
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
  }, [props.scrollAuto, props.onScrollAutoChange, usedLanguageText]);

  return _ScrollAuto;
};
