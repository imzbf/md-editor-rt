import { Themes } from '~/type';
import { prefix } from '~/config';
import { RefObject } from 'react';

const MermaidPlugin = (md: markdownit, options: { themeRef: RefObject<Themes> }) => {
  const temp = md.renderer.rules.fence!.bind(md.renderer.rules);
  md.renderer.rules.fence = (tokens, idx, ops, env, slf) => {
    const token = tokens[idx];
    const code = token.content.trim();
    if (token.info === 'mermaid') {
      return `<div class="${prefix}-mermaid" data-mermaid-theme=${options.themeRef.current}>${code}</div>`;
    }

    return temp!(tokens, idx, ops, env, slf);
  };
};

export default MermaidPlugin;
