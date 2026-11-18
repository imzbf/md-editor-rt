import { createRoot, type Root } from 'react-dom/client';
import styles from './index.css?inline';
import MdEditorElement from './MdEditorElement';

export class MdEditorCustomElement extends HTMLElement {
  private root?: Root;
  private readonly mountPoint: HTMLDivElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = styles;
    this.mountPoint = document.createElement('div');
    // Keep the stylesheet outside React's mount point so renders preserve it.
    shadow.append(style, this.mountPoint);
  }

  connectedCallback() {
    this.root ??= createRoot(this.mountPoint);
    this.root.render(<MdEditorElement />);
  }

  disconnectedCallback() {
    // Release editor listeners when the host removes this element.
    this.root?.unmount();
    this.root = undefined;
  }
}

export function register() {
  if (!customElements.get('md-editor-element')) {
    customElements.define('md-editor-element', MdEditorCustomElement);
  }
}
