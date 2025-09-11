import { EditorView } from '@codemirror/view';
import {
  CSSProperties,
  useEffect,
  useMemo,
  useState,
  MouseEvent,
  useCallback,
  useRef,
  memo
} from 'react';
import { defaultProps, prefix } from '~/config';
import {
  CATALOG_CHANGED,
  GET_EDITOR_VIEW,
  PUSH_CATALOG,
  SEND_EDITOR_VIEW
} from '~/static/event-name';
import { HeadList, MdHeadingId, Themes } from '~/type';
import { classnames, getRelativeTop } from '~/utils';
import bus from '~/utils/event-bus';
import { getComputedStyleNum } from '~/utils/scroll-auto';

import CatalogLink from './CatalogLink';
import { CatalogContext, CatalogContextValue } from './context';

export interface TocItem extends HeadList {
  index: number;
  children?: Array<TocItem>;
}

export interface CatalogProps {
  /**
   * 编辑器的Id，务必与需要绑定的编辑器Id相同
   */
  editorId: string;
  className?: string;
  mdHeadingId?: MdHeadingId;
  /**
   * 指定滚动的容器，选择器需带上对应的符号，默认预览框
   * 元素必须定位！！！！！！
   *
   * 默认：#md-editor-preview-wrapper
   */
  scrollElement?: string | HTMLElement;
  style?: CSSProperties;
  theme?: Themes;
  onClick?: (e: MouseEvent, t: TocItem) => void;
  /**
   * 高亮标题相对滚动容器顶部偏移量，即距离该值时，高亮当前目录菜单项
   *
   * 默认：20px
   */
  offsetTop?: number;
  /**
   * 滚动区域的固定顶部高度
   *
   * 默认：0
   */
  scrollElementOffsetTop?: number;
  /**
   * 高亮的标题变化事件
   *
   * @param heading
   * @returns
   */
  onActive?: (heading: HeadList | undefined, activeElement: HTMLDivElement) => void;
  /**
   * 滚动容器是否在web component中，默认不在
   *
   * 在其中的话通过document查询不到
   */
  isScrollElementInShadow?: boolean;
  /**
   * 设置与哪个区域同步，默认与内容区域同步
   *
   * >= v5.3.0
   *
   * @default 'preview'
   */
  syncWith?: 'editor' | 'preview';
  /**
   * 控制最大显示的目录层级
   *
   * >= v5.5.0
   */
  catalogMaxDepth?: number;
}

const MdCatalog = (props: CatalogProps) => {
  // 获取Id
  const {
    editorId,
    mdHeadingId = defaultProps.mdHeadingId,
    theme = 'light',
    offsetTop = 20,
    syncWith = 'preview'
  } = props;
  const defaultScrollElement = useMemo(() => {
    return `#${editorId}-preview-wrapper`;
  }, [editorId]);
  const [list, setList] = useState<Array<HeadList>>([]);

  const [activeItem, setActiveItem] = useState<HeadList>();

  // 目录根部元素
  const catalogRef = useRef<HTMLDivElement>(null);
  // 获取到的滚动root节点
  const scrollElementRef = useRef<HTMLElement>(null);
  // 滚动容器，包括document
  const scrollContainerRef = useRef<HTMLElement | Document>(undefined);
  // 获取到的目录root节点，注意，不支持目录和编辑器不在同一个web c中使用
  const rootNodeRef = useRef<Document | ShadowRoot>(null);
  // 编辑器view
  const [editorView, setEditorView] = useState<EditorView>();

  /**
   * 指示器样式
   */
  const [indicatorStyles, setIStyles] = useState<CSSProperties>({});

  // 重构的列表
  const catalogs = useMemo(() => {
    const tocItems: TocItem[] = [];

    list.forEach((listItem, index) => {
      if (props.catalogMaxDepth && listItem.level > props.catalogMaxDepth) {
        return;
      }

      const { text, level, line } = listItem;
      const item = {
        level,
        text,
        line,
        index: index + 1,
        active: activeItem === listItem
      };

      if (tocItems.length === 0) {
        // 第一个 item 直接 push
        tocItems.push(item);
      } else {
        let lastItem = tocItems[tocItems.length - 1]; // 最后一个 item

        if (item.level > lastItem.level) {
          // item 是 lastItem 的 children
          for (let i = lastItem.level + 1; i <= 6; i++) {
            const { children } = lastItem;
            if (!children) {
              // 如果 children 不存在
              lastItem.children = [item];
              break;
            }

            lastItem = children[children.length - 1]; // 重置 lastItem 为 children 的最后一个 item

            if (item.level <= lastItem.level) {
              // item level 小于或等于 lastItem level 都视为与 children 同级
              children.push(item);
              break;
            }
          }
        } else {
          // 置于最顶级
          tocItems.push(item);
        }
      }
    });

    return tocItems;
  }, [activeItem, list, props.catalogMaxDepth]);

  const [scrollElement] = useState(() => {
    return props.scrollElement || `#${editorId}-preview-wrapper`;
  });

  const getScrollElement = useCallback(() => {
    if (scrollElement instanceof HTMLElement) {
      return scrollElement;
    }

    let scrollRoot: ShadowRoot | Document = document;
    if (scrollElement === defaultScrollElement || props.isScrollElementInShadow) {
      scrollRoot = catalogRef.current?.getRootNode() as ShadowRoot | Document;
    }

    return scrollRoot.querySelector(scrollElement) as HTMLElement;
  }, [defaultScrollElement, props.isScrollElementInShadow, scrollElement]);

  const onActive = useCallback(
    (tocItem: TocItem, ele: HTMLDivElement) => {
      setIStyles({
        top: ele.offsetTop + getComputedStyleNum(ele, 'padding-top') + 'px'
      });
      props.onActive?.(tocItem, ele);
    },
    [props]
  );

  useEffect(() => {
    // 获取当前元素所在的根节点
    rootNodeRef.current = catalogRef.current!.getRootNode() as Document | ShadowRoot;
  }, []);

  useEffect(() => {
    let cacheList: HeadList[] = [];
    const findActiveHeading = (list_: HeadList[]) => {
      if (list_.length === 0) {
        setActiveItem(undefined);
        setList([]);
        cacheList = list_;
        return false;
      }

      // 获取标记当前位置的目录
      const { activeHead } = list_.reduce(
        (activeData, link, index) => {
          let relativeTop = 0;

          if (syncWith === 'preview') {
            const linkEle = rootNodeRef.current?.getElementById(
              mdHeadingId({
                text: link.text,
                level: link.level,
                index: index + 1,
                currentToken: link.currentToken,
                nextToken: link.nextToken
              })
            );

            if (linkEle instanceof HTMLElement) {
              // 获得当前标题相对滚动容器视窗的高度
              relativeTop = getRelativeTop(linkEle, scrollElementRef.current!);
            }
          } else {
            if (editorView) {
              const top = editorView.lineBlockAt(
                editorView.state.doc.line(link.line + 1).from
              ).top;
              const scrollTop = editorView.scrollDOM.scrollTop;

              relativeTop = top - scrollTop;
            }
          }

          // 当前标题滚动到超出容器的顶部且相比其他的标题最近
          if (relativeTop < offsetTop && relativeTop > activeData.minTop) {
            return {
              activeHead: link,
              minTop: relativeTop
            };
          }

          return activeData;
        },
        {
          activeHead: list_[0],
          minTop: Number.MIN_SAFE_INTEGER
        }
      );

      setActiveItem(activeHead);
      setList(list_);
      cacheList = list_;
    };

    // 滚动区域为document.documentElement需要把监听事件绑定在window上

    const scrollHandler = () => {
      findActiveHeading(cacheList);
    };

    const callback = (_list: Array<HeadList>) => {
      scrollContainerRef.current?.removeEventListener('scroll', scrollHandler);

      if (syncWith === 'editor') {
        scrollContainerRef.current = editorView?.scrollDOM;
      } else {
        // 切换预览状态后，需要重新获取滚动元素
        const scrollElement = getScrollElement();
        scrollElementRef.current = scrollElement;
        scrollContainerRef.current =
          scrollElement === document.documentElement ? document : scrollElement;
      }

      findActiveHeading(_list);
      scrollContainerRef.current?.addEventListener('scroll', scrollHandler);
    };

    bus.on(editorId, {
      name: CATALOG_CHANGED,
      callback
    });

    // 主动触发一次接收
    bus.emit(editorId, PUSH_CATALOG);
    return () => {
      bus.remove(editorId, CATALOG_CHANGED, callback);
      scrollContainerRef.current?.removeEventListener('scroll', scrollHandler);
    };
  }, [offsetTop, mdHeadingId, getScrollElement, editorId, syncWith, editorView]);

  const providerValue = useMemo<CatalogContextValue>(() => {
    return {
      scrollElementRef,
      rootNodeRef
    };
  }, []);

  useEffect(() => {
    const getEditorView = (view: EditorView) => {
      setEditorView(view);
    };

    bus.on(editorId, {
      name: GET_EDITOR_VIEW,
      callback: getEditorView
    });

    bus.emit(editorId, SEND_EDITOR_VIEW);
    return () => {
      bus.remove(editorId, GET_EDITOR_VIEW, getEditorView);
    };
  }, [editorId]);

  return (
    <CatalogContext.Provider value={providerValue}>
      <div
        className={classnames([
          `${prefix}-catalog`,
          theme === 'dark' && `${prefix}-catalog-dark`,
          props.className || ''
        ])}
        style={props.style}
        ref={catalogRef}
      >
        {catalogs.length > 0 && (
          <>
            <div className={`${prefix}-catalog-indicator`} style={indicatorStyles}></div>
            <div className={`${prefix}-catalog-container`}>
              {catalogs.map((item) => {
                return (
                  <CatalogLink
                    mdHeadingId={mdHeadingId}
                    tocItem={item}
                    key={`link-${item.level}-${item.text}`}
                    onActive={onActive}
                    onClick={props.onClick}
                    scrollElementOffsetTop={props.scrollElementOffsetTop}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>
    </CatalogContext.Provider>
  );
};

export default memo(MdCatalog);
