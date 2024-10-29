import { createContext, MutableRefObject } from 'react';

export const CatalogContext = createContext<{
  scrollElementRef: MutableRefObject<HTMLElement | undefined> | undefined;
  rootNodeRef: MutableRefObject<Document | ShadowRoot | undefined> | undefined;
}>({
  scrollElementRef: undefined,
  rootNodeRef: undefined
});
