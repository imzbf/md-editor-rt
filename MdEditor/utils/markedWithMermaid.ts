import mermaid from 'mermaid';

export default {
  name: 'mermaid',
  level: 'block',
  start(src: string) {
    return src.match(/```mermaid/)?.index;
  },
  renderer(token) {
    return `<div class>`;
  }
};
