import { useEffect, useRef } from 'react';
import type { PreviewRendererProps } from '~/type';

// 将 HTML 字符串拆分为元素，返回第一层子节点（包括文本节点）
const splitNodes = (html: string): ChildNode[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return Array.from(doc.body.childNodes);
};

// 比较新旧节点是否相同
const isSameNode = (newNode: ChildNode, currentNode: ChildNode) => {
  if (newNode.nodeType !== currentNode.nodeType) {
    return false;
  }

  if (newNode.nodeType === Node.TEXT_NODE || newNode.nodeType === Node.COMMENT_NODE) {
    return newNode.textContent === currentNode.textContent;
  }

  if (newNode.nodeType === Node.ELEMENT_NODE) {
    return (newNode as Element).outerHTML === (currentNode as Element).outerHTML;
  }

  return newNode.isEqualNode ? newNode.isEqualNode(currentNode) : false;
};

const updateHtmlContent = (
  container: HTMLElement,
  newNodes: ChildNode[],
  prevNodes: ChildNode[]
) => {
  const currentNodes = Array.from(container.childNodes);
  const minLength = Math.min(newNodes.length, prevNodes.length);

  let divergenceIndex = -1;

  for (let i = 0; i < minLength; i += 1) {
    if (!isSameNode(newNodes[i], prevNodes[i])) {
      divergenceIndex = i;
      break;
    }
  }

  if (divergenceIndex === -1) {
    if (prevNodes.length > newNodes.length) {
      divergenceIndex = newNodes.length;
    } else if (newNodes.length > prevNodes.length) {
      divergenceIndex = prevNodes.length;
    } else {
      return;
    }
  }

  const startRemove = Math.min(divergenceIndex, currentNodes.length);

  for (let i = currentNodes.length - 1; i >= startRemove; i -= 1) {
    currentNodes[i].remove();
  }

  for (let i = divergenceIndex; i < newNodes.length; i += 1) {
    container.appendChild(newNodes[i].cloneNode(true));
  }
};

type UpdateOnDemandProps = PreviewRendererProps;

const UpdateOnDemand: React.FC<UpdateOnDemandProps> = ({ html, id, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  // 永远缓存一份第一次的html，保证ssr正确
  const firstHtml = useRef<{ __html: string }>({ __html: html });
  const prevHtmlRef = useRef<string>(html);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    const prevHtml = prevHtmlRef.current;

    if (prevHtml === html) {
      return;
    }

    const newNodes = splitNodes(html);
    const prevNodes = splitNodes(prevHtml);

    updateHtmlContent(container, newNodes, prevNodes);

    prevHtmlRef.current = html;
  }, [html]);

  return (
    <div
      id={id}
      className={className}
      dangerouslySetInnerHTML={firstHtml.current}
      ref={containerRef}
    />
  );
};

export default UpdateOnDemand;
