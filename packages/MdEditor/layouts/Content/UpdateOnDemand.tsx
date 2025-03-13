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

// 比较两个 HTML 内容，返回更新的节点
const compareHtml = (newHtml: string, currentHtml: string) => {
  const newNodes = splitHtml(newHtml);
  const currentNodes = splitHtml(currentHtml);

  // 对比每个节点，找出差异的部分
  return newNodes
    .map((node, index) => ({
      index,
      newNode: node.outerHTML,
      isUpdated: currentNodes[index]?.outerHTML !== node.outerHTML
    }))
    .filter((update) => update.isUpdated); // 过滤出差异节点
};

const UpdateOnDemand = ({ html }: Props) => {
  const { editorId, previewTheme, showCodeRowNumber } = useContext(EditorContext);

  const htmlContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!htmlContainerRef.current) return;
    const updates = compareHtml(html, htmlContainerRef.current.innerHTML);

    updates.forEach(({ index, newNode }) => {
      const targetNode = htmlContainerRef.current?.children[index];
      if (targetNode) {
        targetNode.outerHTML = newNode;
      } else {
        htmlContainerRef.current?.insertAdjacentHTML('beforeend', newNode);
      }
    });
  }, [html]);

  useEffect(() => {
    if (htmlContainerRef.current) {
      htmlContainerRef.current.innerHTML = html;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      id={`${editorId}-preview`}
      className={classnames([
        `${prefix}-preview`,
        `${previewTheme}-theme`,
        showCodeRowNumber && `${prefix}-scrn`
      ])}
      ref={htmlContainerRef}
    />
  );
};

export default UpdateOnDemand;
