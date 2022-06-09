import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

interface ReadExtensionProp {
  mdText: string;
}

const ModalToolbar = MdEditor.ModalToolbar;

const ReadExtension = (props: ReadExtensionProp) => {
  const [state, setState] = useState({
    visible: false,
    modalFullscreen: false
  });

  const store = useSelector((state: any) => state) as StateType;

  return (
    <ModalToolbar
      visible={state.visible}
      isFullscreen={state.modalFullscreen}
      showAdjust
      title="弹窗预览"
      modalTitle="编辑预览"
      width="870px"
      height="600px"
      onClick={() => {
        setState({
          ...state,
          visible: true
        });
      }}
      onClose={() => {
        setState({
          ...state,
          visible: false
        });
      }}
      onAdjust={() => {
        setState({
          ...state,
          modalFullscreen: !state.modalFullscreen
        });
      }}
      trigger={
        <svg className="md-icon" aria-hidden="true">
          <use xlinkHref="#icon-read"></use>
        </svg>
      }
    >
      {state.visible ? (
        <div
          style={{
            height: '100%',
            padding: '20px',
            overflow: 'auto'
          }}
        >
          <MdEditor
            theme={store.theme}
            language={store.lang}
            previewTheme={store.previewTheme}
            codeTheme={store.codeTheme}
            editorId="edit2preview"
            previewOnly
            modelValue={props.mdText}
          />
        </div>
      ) : (
        <></>
      )}
    </ModalToolbar>
  );
};

export default ReadExtension;
