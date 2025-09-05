import { useContext, useEffect, useRef } from 'react';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { prefix } from '~~/config';

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
const compareHtml = (newNodes: ChildNode[], currentNodes: ChildNode[]) => {
  const updates: { index: number; newNode: ChildNode }[] = [];
  const deletes: ChildNode[] = [];

  newNodes.forEach((newNode, index) => {
    const currentNode = currentNodes[index];

    // 如果旧节点不存在，标记为新增
    if (!currentNode) {
      updates.push({ index, newNode });
      return;
    }

    // 如果节点类型不一致或内容不同，标记更新
    if (
      newNode.nodeType !== currentNode.nodeType ||
      newNode.textContent !== currentNode.textContent ||
      (newNode.nodeType === 1 &&
        (newNode as HTMLElement).outerHTML !== (currentNode as HTMLElement).outerHTML)
    ) {
      updates.push({ index, newNode });
    }
  });

  // 旧节点中有但新 HTML 中不存在的，标记为需要删除
  if (currentNodes.length > newNodes.length) {
    for (let i = newNodes.length; i < currentNodes.length; i++) {
      deletes.push(currentNodes[i]);
    }
  }

  return { updates, deletes };
};

const UpdateOnDemand = ({ html }: Props) => {
  const { editorId, previewTheme, showCodeRowNumber } = useContext(EditorContext);

  // 永远缓存一份第一次的html，保证ssr正确
  const firstHtml = useRef<{ __html: string }>({ __html: html });

  const htmlContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!htmlContainer.current) return;
    const newNodes = splitNodes(html);
    // 从页面上获取真实的节点
    const currentNodes = Array.from(htmlContainer.current.childNodes || []);
    const { updates, deletes } = compareHtml(newNodes, currentNodes);

    // 先删除待删除的节点
    deletes.forEach((node) => {
      node.remove();
    });

    // 更新或插入新的节点
    updates.forEach(({ index, newNode }) => {
      const targetNode = htmlContainer.current!.childNodes[index];

      // 如果目标节点不存在，直接插入新节点
      if (!targetNode) {
        htmlContainer.current!.appendChild(newNode.cloneNode(true));
      } else {
        // 如果目标节点存在但内容需要更新，替换
        htmlContainer.current!.replaceChild(newNode.cloneNode(true), targetNode);
      }
    });
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
