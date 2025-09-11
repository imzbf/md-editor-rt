import { createContext, RefObject } from 'react';

export interface CatalogContextValue {
  scrollElementRef?: RefObject<HTMLElement | null>;
  rootNodeRef?: RefObject<Document | ShadowRoot | null>;
}

export const CatalogContext = createContext<CatalogContextValue>({
  scrollElementRef: undefined,
  rootNodeRef: undefined
});
