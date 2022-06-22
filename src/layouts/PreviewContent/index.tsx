import React from 'react';
import { useSelector } from 'react-redux';
import MdEditor from 'md-editor-rt';
import { StateType } from '@/store';
import { debounce } from '@/utils';

interface IzPreviewContentProp {
  editorId: string;
  modelValue: string;
}

const onHtmlChanged = debounce(() => {
  const { hash } = location;

  if (/^#/.test(hash)) {
    const headingId = decodeURIComponent(hash.replace('#', ''));

    if (headingId) {
      const targetHeadDom = document.getElementById(headingId);

      if (targetHeadDom) {
        const scrollLength = (targetHeadDom as HTMLHeadElement).offsetTop + 414;

        window.scrollTo({
          top: scrollLength,
          behavior: 'smooth'
        });
      }
    }
  }
});

const IzPreviewContent = (props: IzPreviewContentProp) => {
  const state = useSelector<StateType>((state) => state) as StateType;

  return (
    <div className="content">
      <MdEditor
        editorId={props.editorId}
        theme={state.theme}
        modelValue={props.modelValue}
        previewTheme={state.previewTheme}
        previewOnly
        showCodeRowNumber
        codeTheme={state.codeTheme}
        onHtmlChanged={onHtmlChanged}
      />
    </div>
  );
};

export default IzPreviewContent;
