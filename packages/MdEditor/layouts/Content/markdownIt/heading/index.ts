import markdownit from 'markdown-it';
import { RefObject } from 'react';
import { HeadList, MdHeadingId } from '~/type';

export interface HeadingPluginOps extends markdownit.Options {
  mdHeadingId: MdHeadingId;
  headsRef: RefObject<HeadList[]>;
}

const HeadingPlugin = (md: markdownit, options: HeadingPluginOps) => {
  md.renderer.rules.heading_open = (tokens, idx) => {
    const token = tokens[idx];

    const text =
      tokens[idx + 1].children?.reduce((p, c) => {
        return (
          p +
          (['text', 'code_inline', 'math_inline'].includes(c.type) ? c.content || '' : '')
        );
      }, '') || '';

    const level = token.markup.length as 1 | 2 | 3 | 4 | 5 | 6;

    options.headsRef.current.push({
      text,
      level,
      line: token.map![0],
      currentToken: token,
      nextToken: tokens[idx + 1]
    });

    if (token.map && token.level === 0) {
      token.attrSet(
        'id',
        options.mdHeadingId({
          text,
          level,
          index: options.headsRef.current.length,
          currentToken: token,
          nextToken: tokens[idx + 1]
        })
      );
    }

    return md.renderer.renderToken(tokens, idx, options);
  };

  md.renderer.rules.heading_close = (tokens, idx, opts, _env, self) => {
    return self.renderToken(tokens, idx, opts);
  };
};

export default HeadingPlugin;
