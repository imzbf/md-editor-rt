import React, { MouseEvent } from 'react';
import { useSelector } from 'react-redux';
import MdEditor from 'md-editor-rt';
import type { TocItem } from 'md-editor-rt/lib/MdEditor/extensions/MdCatalog';
import { StateType } from '@/store';

const { MdCatalog } = MdEditor;

interface IzCatalogProp {
  editorId: string;
}

const scrollElement = document.documentElement;

const onClick = (e: MouseEvent, t: TocItem) => {
  history.replaceState({}, '', `${location.pathname}#${t.text}`);
};

const IzCatalog = (props: IzCatalogProp) => {
  const state = useSelector<StateType>((state) => state) as StateType;

  return (
    <div className="catalog">
      <div className="affix">
        <MdCatalog
          editorId={props.editorId}
          theme={state.theme}
          scrollElement={scrollElement}
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default IzCatalog;
