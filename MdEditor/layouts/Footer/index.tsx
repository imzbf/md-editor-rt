import React, { ReactElement, useCallback, useMemo } from 'react';
import { allFooter, prefix } from '../../config';
import { Footers } from '../../type';
import MarkdownTotal from './MarkdownTotal';
import ScrollAuto from './ScrollAuto';

interface FooterProp {
  modelValue: string;
  footers: Array<Footers>;
  scrollAuto: boolean;
  onScrollAutoChange: (v: boolean) => void;
  defFooters: Array<string | ReactElement>;
}

const Footer = (props: FooterProp) => {
  const footerRender = useCallback(
    (name: Footers) => {
      if (allFooter.includes(name)) {
        switch (name) {
          case 'markdownTotal': {
            return <MarkdownTotal modelValue={props.modelValue} key="markdown-total" />;
          }
          case 'scrollSwitch': {
            return (
              <ScrollAuto
                scrollAuto={props.scrollAuto}
                onScrollAutoChange={props.onScrollAutoChange}
                key="scroll-auto"
              />
            );
          }
        }
      } else if (props.defFooters instanceof Array) {
        return props.defFooters[name as number] || '';
      } else {
        return '';
      }
    },
    [props.modelValue, props.scrollAuto, props.onScrollAutoChange, props.defFooters]
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

export default React.memo(Footer);
