import r2wc from '@r2wc/react-to-web-component';
import MdEditorElement from './MdEditorElement';

const convertReact2WebComponent = (
  Component: Parameters<typeof r2wc>[0],
  options?: Parameters<typeof r2wc>[1]
) => {
  const WebComponent = r2wc(Component, options);

  class WebComponentWithStyle extends WebComponent {
    constructor() {
      super();

      const styleTag = document.getElementById('custom_id');
      if (styleTag) {
        this.shadowRoot?.appendChild(styleTag.cloneNode(true));
      }
    }
  }

  return WebComponentWithStyle;
};

customElements.define(
  'md-editor-element',
  convertReact2WebComponent(MdEditorElement, {
    shadow: 'open'
  })
);
