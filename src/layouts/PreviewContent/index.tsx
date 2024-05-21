import React from 'react';
import { useSelector } from 'react-redux';
import { MdPreview } from 'md-editor-rt';
import { StateType } from '@/store';
import { debounce, getRootOffset } from '@vavt/util';

interface IzPreviewContentProp {
  editorId: string;
  modelValue: string;
  showCodeRowNumber: boolean;
}

const { hash } = location;

const onHtmlChanged = debounce<any, any>(() => {
  if (/^#/.test(hash)) {
    const headingId = decodeURIComponent(hash.replace('#', ''));

    if (headingId) {
      const targetHeadDom = document.getElementById(headingId);

      if (targetHeadDom) {
        const scrollLength = getRootOffset(targetHeadDom).offsetTop - 10;

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
      <MdPreview
        editorId={props.editorId}
        language={state.lang}
        theme={state.theme}
        modelValue={props.modelValue}
        previewTheme={state.previewTheme}
        showCodeRowNumber={props.showCodeRowNumber}
        codeTheme={state.codeTheme}
        onHtmlChanged={onHtmlChanged}
        autoFoldThreshold={16}
      />
    </div>
  );
};

IzPreviewContent.defaultProps = {
  showCodeRowNumber: true
};

export default IzPreviewContent;
