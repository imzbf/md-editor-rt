import { useContext, useEffect, useRef } from 'react';
import { prefix } from '~~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

interface Props {
  html: string;
}

// 将 HTML 字符串拆分为元素，返回第一层子元素
const splitHtml = (html: string): HTMLElement[] => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  return Array.from(doc.body.children) as HTMLElement[];
};

// 比较新旧 HTML，返回需更新和删除的节点信息
const compareHtml = (newHtml: string, currentHtml: string) => {
  const newNodes = splitHtml(newHtml);
  const currentNodes = splitHtml(currentHtml);

  const updates: { index: number; newNode: string }[] = [];
  const deletes: number[] = [];

  // 对比每个节点，找出差异的部分
  newNodes.forEach((node, index) => {
    if (!currentNodes[index]) {
      // 该索引下的新节点不存在于旧 HTML，需要新增
      updates.push({ index, newNode: node.outerHTML });
    } else if (currentNodes[index].outerHTML !== node.outerHTML) {
      // 该索引下的节点存在但内容不同，需要更新
      updates.push({ index, newNode: node.outerHTML });
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

  const htmlContainerRef = useRef<HTMLDivElement>(null);
  const cacheHtml = useRef<string>('');

  useEffect(() => {
    if (!htmlContainerRef.current) return;
    const { updates, deletes } = compareHtml(html, cacheHtml.current);

    // 先删除多余的节点（从后向前删除，避免索引问题）
    deletes.reverse().forEach((index) => {
      htmlContainerRef.current?.children[index]?.remove();
    });

    // 更新或插入新的节点
    updates.forEach(({ index, newNode }) => {
      const targetNode = htmlContainerRef.current?.children[index];
      if (targetNode) {
        // 如果目标节点存在，更新它的 outerHTML
        targetNode.outerHTML = newNode;
      } else {
        // 如果目标节点不存在，则插入新的节点
        htmlContainerRef.current?.insertAdjacentHTML('beforeend', newNode);
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
      ref={htmlContainerRef}
    />
  );
};

export default UpdateOnDemand;
