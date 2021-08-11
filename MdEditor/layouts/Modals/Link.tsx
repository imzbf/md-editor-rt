import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../components/Modal';
import bus from '../../utils/event-bus';
import { prefix } from '../../config';
import { EditorContext, StaticTextDefaultValue } from '../../Editor';

interface LinkModalProp {
  type: 'link' | 'image' | 'help';
  visible: boolean;
  ult: StaticTextDefaultValue;
  onCancel: () => void;
  onOk: (data?: any) => void;
  to: HTMLElement;
  onClip: () => void;
}

export default (props: LinkModalProp) => {
  const { ult } = props;
  const { editorId } = useContext(EditorContext);

  const title = useMemo(() => {
    switch (props.type) {
      case 'link': {
        return `${ult.linkModalTips?.title}${ult.toolbarTips?.link}`;
      }
      case 'image': {
        return `${ult.linkModalTips?.title}${ult.toolbarTips?.image}`;
      }
      default: {
        return '';
      }
    }
  }, [props.type]);

  // 链接
  const [linkData, setLinkData] = useState({
    desc: '',
    url: ''
  });

  // 上传控件
  const uploadRef = useRef<HTMLInputElement>(null);

  const uploadHandler = () => {
    bus.emit('uploadImage', (uploadRef.current as HTMLInputElement).files, props.onOk);
    // 清空内容，否则无法再次选取同一张图片
    (uploadRef.current as HTMLInputElement).value = '';
  };

  useEffect(() => {
    if (props.type === 'image') {
      // nextTick(() => {
      (uploadRef.current as HTMLInputElement).addEventListener('change', uploadHandler);
      // });
    }
  }, [props.type]);

  return (
    <Modal title={title} visible={props.visible} onClosed={props.onCancel} to={props.to}>
      <div className={`${prefix}-form-item`}>
        <label className={`${prefix}-lable`} htmlFor={`link-desc-${editorId}`}>
          {ult.linkModalTips?.descLable}
        </label>
        <input
          placeholder={ult.linkModalTips?.descLablePlaceHolder}
          className={`${prefix}-input`}
          id={`link-desc-${editorId}`}
          type="text"
          value={linkData.desc}
          onChange={(e) => {
            setLinkData({
              ...linkData,
              desc: (e.target as HTMLInputElement).value
            });
          }}
        />
      </div>
      <div className={`${prefix}-form-item`}>
        <label className={`${prefix}-lable`} htmlFor={`link-url-${editorId}`}>
          {ult.linkModalTips?.urlLable}
        </label>
        <input
          placeholder={ult.linkModalTips?.UrlLablePlaceHolder}
          className={`${prefix}-input`}
          id={`link-url-${editorId}`}
          type="text"
          value={linkData.url}
          onChange={(e) => {
            setLinkData({
              ...linkData,
              url: (e.target as HTMLInputElement).value
            });
          }}
        />
      </div>
      <div className={`${prefix}-form-item`}>
        <button
          className={`${prefix}-btn ${props.type === 'link' && prefix + '-btn-row'}`}
          onClick={() => {
            props.onOk(linkData);

            setLinkData({
              ...linkData,
              desc: '',
              url: ''
            });
          }}
        >
          {ult.linkModalTips?.buttonOK}
        </button>
        {props.type === 'image' && (
          <>
            <button
              className={`${prefix}-btn`}
              onClick={() => {
                // nextTick(() => {
                (uploadRef.current as HTMLInputElement).click();
                // });
              }}
            >
              {ult.linkModalTips?.buttonUpload}
            </button>
            <button className={`${prefix}-btn`} onClick={props.onClip}>
              {ult.linkModalTips?.buttonUploadClip}
            </button>
            <input
              ref={uploadRef}
              accept="image/*"
              type="file"
              multiple={true}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
    </Modal>
  );
};
