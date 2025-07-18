/**
 * 源码来自https://github.com/waylonflinn/markdown-it-katex
 *
 * 该代码只是正对md-editor-v3系列功能做了适配
 */
import { RefObject } from 'react';
import markdownit, { Renderer, Token, ParserInline, ParserBlock } from 'markdown-it';
import { prefix, globalConfig } from '~/config';
import { mergeAttrs } from '~/utils/md-it';

interface CreateOptions {
  delimiters: Array<{
    open: string;
    close: string;
  }>;
}

interface KatexOptions {
  katexRef: RefObject<any>;
  inlineDelimiters?: Array<{
    open: string;
    close: string;
  }>;
  blockDelimiters?: Array<{
    open: string;
    close: string;
  }>;
}

const delimiters = {
  block: [
    { open: '$$', close: '$$' },
    { open: '\\[', close: '\\]' }
  ],
  inline: [
    { open: '$$', close: '$$' },
    { open: '$', close: '$' },
    { open: '\\[', close: '\\]' },
    { open: '\\(', close: '\\)' }
  ]
};

const create_math_inline =
  (options: CreateOptions): ParserInline.RuleInline =>
  (state, silent) => {
    const delimiters = options.delimiters;
    let match, token, pos;

    for (const delim of delimiters) {
      if (state.src.startsWith(delim.open, state.pos)) {
        const start = state.pos + delim.open.length;
        match = start;

        while ((match = state.src.indexOf(delim.close, match)) !== -1) {
          pos = match - 1;
          while (state.src[pos] === '\\') {
            pos -= 1;
          }
          if ((match - pos) % 2 === 1) {
            break;
          }
          match += delim.close.length;
        }

        if (match === -1) {
          if (!silent) {
            state.pending += delim.open;
          }
          state.pos = start;
          return true;
        }

        if (match - start === 0) {
          if (!silent) {
            state.pending += delim.open + delim.close;
          }
          state.pos = start + delim.close.length;
          return true;
        }

        if (!silent) {
          const inlineContent = state.src.slice(start, match);

          // 创建数学公式 token
          token = state.push('math_inline', 'math', 0);
          token.markup = delim.open;
          token.content = inlineContent;
        }

        state.pos = match + delim.close.length;
        return true;
      }
    }
    return false;
  };

const create_math_block =
  (options: CreateOptions): ParserBlock.RuleBlock =>
  (state, start, end, silent) => {
    const delimiters = options.delimiters;
    let firstLine,
      lastLine,
      next,
      lastPos,
      found = false;
    let pos = state.bMarks[start] + state.tShift[start];
    let max = state.eMarks[start];

    for (const delim of delimiters) {
      // 仅当 $$ 符号在行首且是单独一行时，才作为块级公式处理
      if (
        state.src.slice(pos, pos + delim.open.length) === delim.open &&
        state.src.slice(max - delim.close.length, max) === delim.close
      ) {
        pos += delim.open.length;
        firstLine = state.src.slice(pos, max);

        if (silent) {
          return true;
        }
        if (firstLine.trim().slice(-delim.close.length) === delim.close) {
          firstLine = firstLine.trim().slice(0, -delim.close.length);
          found = true;
        }

        for (next = start; !found; ) {
          next++;
          if (next >= end) {
            break;
          }
          pos = state.bMarks[next] + state.tShift[next];
          max = state.eMarks[next];

          if (pos < max && state.tShift[next] < state.blkIndent) {
            break;
          }

          if (
            state.src.slice(pos, max).trim().slice(-delim.close.length) === delim.close
          ) {
            lastPos = state.src.slice(0, max).lastIndexOf(delim.close);
            lastLine = state.src.slice(pos, lastPos);
            found = true;
          }
        }

        state.line = next + 1;

        const token = state.push('math_block', 'math', 0);
        token.block = true;
        token.content =
          (firstLine && firstLine.trim() ? firstLine + '\n' : '') +
          state.getLines(start + 1, next, state.tShift[start], true) +
          (lastLine && lastLine.trim() ? lastLine : '');
        token.map = [start, state.line];
        token.markup = delim.open;
        return true;
      }
    }
    return false;
  };

const KatexPlugin = (
  md: markdownit,
  { katexRef, inlineDelimiters, blockDelimiters }: KatexOptions
) => {
  const katexInline: Renderer.RenderRule = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    const tmpToken = {
      attrs: mergeAttrs(token, [['class', `${prefix}-katex-inline`]])
    };

    if (katexRef.current) {
      const html = katexRef.current.renderToString(
        token.content,
        globalConfig.katexConfig({
          throwOnError: false
        })
      );

      return `<span ${slf.renderAttrs(tmpToken as Token)} data-processed>${html}</span>`;
    } else {
      return `<span ${slf.renderAttrs(tmpToken as Token)}>${token.content}</span>`;
    }
  };

  const katexBlock: Renderer.RenderRule = (tokens, idx, options, env, slf) => {
    const token = tokens[idx];
    const tmpToken = {
      attrs: mergeAttrs(token, [['class', `${prefix}-katex-block`]])
    };

    if (katexRef.current) {
      const html = katexRef.current.renderToString(
        token.content,
        globalConfig.katexConfig({
          throwOnError: false,
          displayMode: true
        })
      );

      return `<p ${slf.renderAttrs(tmpToken as Token)} data-processed>${html}</p>`;
    } else {
      return `<p ${slf.renderAttrs(tmpToken as Token)}>${token.content}</p>`;
    }
  };

  md.inline.ruler.before(
    'escape',
    'math_inline',
    create_math_inline({
      delimiters: inlineDelimiters || delimiters.inline
    })
  );
  md.block.ruler.after(
    'blockquote',
    'math_block',
    create_math_block({
      delimiters: blockDelimiters || delimiters.block
    }),
    {
      alt: ['paragraph', 'reference', 'blockquote', 'list']
    }
  );

  md.renderer.rules.math_inline = katexInline;
  md.renderer.rules.math_block = katexBlock;
};

export default KatexPlugin;
