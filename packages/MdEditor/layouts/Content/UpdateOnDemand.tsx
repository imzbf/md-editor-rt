import { useContext, useEffect, useRef } from 'react';
import { prefix } from '~~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

interface Props {
  html: string;
}

// 将 HTML 字符串拆分为元素，返回第一层子节点（包括文本节点）
const splitNodes = (html: string): ChildNode[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return Array.from(doc.body.childNodes); // 包括文本节点
};

// 比较新旧 HTML，返回需更新和删除的节点信息
const compareHtml = (newHtml: string, currentHtml: string) => {
  const newNodes = splitNodes(newHtml);
  const currentNodes = splitNodes(currentHtml);

  const updates: { index: number; newNode: string; isText: boolean }[] = [];
  const deletes: number[] = [];

  newNodes.forEach((newNode, index) => {
    const currentNode = currentNodes[index];

    if (!currentNode) {
      // 旧 HTML 没有该节点，需要新增
      updates.push({
        index,
        newNode:
          newNode.nodeType === 3
            ? newNode.textContent || ''
            : (newNode as HTMLElement).outerHTML,
        isText: newNode.nodeType === 3
      });
    } else if (newNode.nodeType === 3 && currentNode.nodeType === 3) {
      // 纯文本节点对比 textContent
      if (newNode.textContent !== currentNode.textContent) {
        updates.push({
          index,
          newNode: newNode.textContent || '',
          isText: true
        });
      }
    } else if (newNode.nodeType !== 3 && currentNode.nodeType !== 3) {
      // 非文本节点，对比 outerHTML
      if ((currentNode as HTMLElement).outerHTML !== (newNode as HTMLElement).outerHTML) {
        updates.push({
          index,
          newNode: (newNode as HTMLElement).outerHTML,
          isText: false
        });
      }
    } else {
      // 一个是文本节点，一个是标签节点，直接替换
      updates.push({
        index,
        newNode:
          newNode.nodeType === 3
            ? newNode.textContent || ''
            : (newNode as HTMLElement).outerHTML,
        isText: newNode.nodeType === 3
      });
    }
  });

  // 旧节点中有但新 HTML 中不存在的，标记为需要删除
  if (currentNodes.length > newNodes.length) {
    for (let i = newNodes.length; i < currentNodes.length; i++) {
      deletes.push(i);
    }
  }

  return { updates, deletes };
};

const UpdateOnDemand = ({ html }: Props) => {
  const { editorId, previewTheme, showCodeRowNumber } = useContext(EditorContext);

  // 永远缓存一份第一次的html，保证ssr正确
  const firstHtml = useRef<{ __html: string }>({ __html: html });

  const htmlContainer = useRef<HTMLDivElement>(null);
  const cacheHtml = useRef<string>('');

  useEffect(() => {
    if (!htmlContainer.current) return;
    const { updates, deletes } = compareHtml(html, cacheHtml.current);

    // 先删除多余的节点（从后向前删除，避免索引问题）
    deletes.reverse().forEach((index) => {
      htmlContainer.current?.childNodes[index]?.remove();
    });

    // 更新或插入新的节点
    updates.forEach(({ index, newNode, isText }) => {
      const targetNode = htmlContainer.current?.childNodes[index];

      if (targetNode) {
        if (isText) {
          // 直接修改 textContent
          targetNode.textContent = newNode;
        } else {
          // 替换整个 HTML 结构
          (targetNode as HTMLElement).outerHTML = newNode;
        }
      } else {
        // 如果目标节点不存在，则插入新的节点
        if (htmlContainer.current) {
          if (isText) {
            const textNode = document.createTextNode(newNode);
            htmlContainer.current.appendChild(textNode);
          } else {
            htmlContainer.current.insertAdjacentHTML('beforeend', newNode);
          }
        }
      }
    });

    cacheHtml.current = html;
  }, [html]);

  return (
    <div
      id={`${editorId}-preview`}
      className={classnames([
        `${prefix}-preview`,
        `${previewTheme}-theme`,
        showCodeRowNumber && `${prefix}-scrn`
      ])}
      dangerouslySetInnerHTML={firstHtml.current}
      ref={htmlContainer}
    />
  );
};

export default UpdateOnDemand;
