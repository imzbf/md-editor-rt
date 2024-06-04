import React, { useContext, useEffect, useMemo, useState } from 'react';
import Modal from '~/components/Modal';
import { prefix } from '~/config';
import { EditorContext } from '~/Editor';

interface LinkModalProps {
  type: 'link' | 'image' | 'help';
  visible: boolean;
  onCancel: () => void;
  onOk: (data?: any) => void;
}

const LinkModal = (props: LinkModalProps) => {
  const { editorId, usedLanguageText } = useContext(EditorContext);

  const title = useMemo(() => {
    switch (props.type) {
      case 'link': {
        return usedLanguageText.linkModalTips?.linkTitle;
      }
      case 'image': {
        return usedLanguageText.linkModalTips?.imageTitle;
      }
      default: {
        return '';
      }
    }
  }, [props.type, usedLanguageText]);

  // 链接
  const [linkData, setLinkData] = useState({
    desc: '',
    url: ''
  });

  useEffect(() => {
    if (!props.visible) {
      setTimeout(() => {
        setLinkData({
          desc: '',
          url: ''
        });
      }, 200);
    }
  }, [props.visible]);

  return useMemo(() => {
    return (
      <Modal title={title} visible={props.visible} onClose={props.onCancel}>
        <div className={`${prefix}-form-item`}>
          <label className={`${prefix}-label`} htmlFor={`link-desc-${editorId}`}>
            {usedLanguageText.linkModalTips?.descLabel}
          </label>
          <input
            placeholder={usedLanguageText.linkModalTips?.descLabelPlaceHolder}
            className={`${prefix}-input`}
            id={`link-desc-${editorId}`}
            type="text"
            value={linkData.desc}
            onChange={(e) => {
              setLinkData((_linkData) => ({
                ..._linkData,
                desc: (e.target as HTMLInputElement).value
              }));
            }}
          />
        </div>
        <div className={`${prefix}-form-item`}>
          <label className={`${prefix}-label`} htmlFor={`link-url-${editorId}`}>
            {usedLanguageText.linkModalTips?.urlLabel}
          </label>
          <input
            placeholder={usedLanguageText.linkModalTips?.urlLabelPlaceHolder}
            className={`${prefix}-input`}
            id={`link-url-${editorId}`}
            type="text"
            value={linkData.url}
            onChange={(e) => {
              setLinkData((_linkData) => ({
                ..._linkData,
                url: (e.target as HTMLInputElement).value
              }));
            }}
          />
        </div>
        <div className={`${prefix}-form-item`}>
          <button
            className={`${prefix}-btn ${prefix}-btn-row`}
            type="button"
            onClick={() => {
              props.onOk(linkData);

              setLinkData((_linkData) => ({
                ..._linkData,
                desc: '',
                url: ''
              }));
            }}
          >
            {usedLanguageText.linkModalTips?.buttonOK}
          </button>
        </div>
      </Modal>
    );
  }, [
    title,
    props,
    editorId,
    usedLanguageText.linkModalTips?.descLabel,
    usedLanguageText.linkModalTips?.descLabelPlaceHolder,
    usedLanguageText.linkModalTips?.urlLabel,
    usedLanguageText.linkModalTips?.urlLabelPlaceHolder,
    usedLanguageText.linkModalTips?.buttonOK,
    linkData
  ]);
};

export default LinkModal;
