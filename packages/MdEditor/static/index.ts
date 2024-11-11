import { prefix } from '../config';

export const CDN_IDS: Record<string, string> = {
  hljs: `${prefix}-hljs`,
  hlcss: `${prefix}-hlCss`,
  prettier: `${prefix}-prettier`,
  prettierMD: `${prefix}-prettierMD`,
  cropperjs: `${prefix}-cropper`,
  croppercss: `${prefix}-cropperCss`,
  screenfull: `${prefix}-screenfull`,
  mermaidM: `${prefix}-mermaid-m`,
  mermaid: `${prefix}-mermaid`,
  katexjs: `${prefix}-katex`,
  katexcss: `${prefix}-katexCss`
};
