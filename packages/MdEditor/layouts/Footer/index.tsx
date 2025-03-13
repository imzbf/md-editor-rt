import {
  cloneElement,
  memo,
  ReactElement,
  useCallback,
  useContext,
  useMemo
} from 'react';
import { allFooter, prefix } from '~/config';
import { Footers } from '~/type';
import { EditorContext } from '~/context';

import MarkdownTotal from './MarkdownTotal';
import ScrollAuto from './ScrollAuto';

interface FooterProps {
  modelValue: string;
  footers: Array<Footers>;
  noScrollAuto: boolean;
  scrollAuto: boolean;
  onScrollAutoChange: (v: boolean) => void;
  defFooters: Array<string | ReactElement>;
}

const Footer = (props: FooterProps) => {
  const { theme, language, disabled } = useContext(EditorContext);

  const footerRender = useCallback(
    (name: Footers) => {
      if (allFooter.includes(name)) {
        switch (name) {
          case 'markdownTotal': {
            return <MarkdownTotal modelValue={props.modelValue} key="markdown-total" />;
          }
          case 'scrollSwitch': {
            return (
              !props.noScrollAuto && (
                <ScrollAuto
                  scrollAuto={props.scrollAuto}
                  onScrollAutoChange={props.onScrollAutoChange}
                  key="scroll-auto"
                />
              )
            );
          }
        }
      } else {
        const defItem = props.defFooters[name as number];

        if (typeof defItem !== 'string') {
          const defItemCloned = cloneElement(defItem, {
            theme: defItem.props.theme || theme,
            language: defItem.props.language || language,
            disabled: defItem.props.disabled || disabled
          });

          return defItemCloned;
        }

        return defItem || '';
      }
    },
    [
      props.modelValue,
      props.noScrollAuto,
      props.scrollAuto,
      props.onScrollAutoChange,
      props.defFooters,
      theme,
      language,
      disabled
    ]
  );

  const [LeftFooter, RightFooter] = useMemo(() => {
    const moduleSplitIndex = props.footers.indexOf('=');

    // 左侧部分
    const barLeft =
      moduleSplitIndex === -1 ? props.footers : props.footers.slice(0, moduleSplitIndex);

    const barRight =
      moduleSplitIndex === -1
        ? []
        : props.footers.slice(moduleSplitIndex, Number.MAX_SAFE_INTEGER);

    return [
      barLeft.map((name) => footerRender(name)),
      barRight.map((name) => footerRender(name))
    ];
  }, [props.footers, footerRender]);

  return (
    <div className={`${prefix}-footer`}>
      <div className={`${prefix}-footer-left`}>{LeftFooter}</div>
      <div className={`${prefix}-footer-right`}>{RightFooter}</div>
    </div>
  );
};

export default memo(Footer);
