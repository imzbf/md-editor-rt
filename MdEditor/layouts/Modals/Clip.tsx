import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Modal from '../../components/Modal';
import { EditorContext, StaticTextDefaultValue } from '../../Editor';
import { prefix } from '../../config';
import { base642File } from '../../utils';
import bus from '../../utils/event-bus';

import './style.less';

interface ClipModalProp {
  visible: boolean;
  ult: StaticTextDefaultValue;
  onCancel: () => void;
  onOk: (data?: any) => void;
}

let cropper: any = null;

const ClipModal = (props: ClipModalProp) => {
  const { ult } = props;
  const { editorId } = useContext(EditorContext);
  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadImgRef = useRef<HTMLImageElement>(null);

  const [data, setData] = useState({
    imgSelected: false,
    imgSrc: ''
  });

  useEffect(() => {
    setTimeout(() => {
      (uploadRef.current as HTMLInputElement).addEventListener('change', () => {
        const fileList = (uploadRef.current as HTMLInputElement).files || [];

        if (fileList?.length > 0) {
          const fileReader = new FileReader();

          fileReader.onload = (e: any) => {
            setData({
              imgSelected: true,
              imgSrc: e.target.result
            });
          };

          fileReader.readAsDataURL(fileList[0]);
        }
      });
    }, 0);

    // TODO 优化卸载清除监听
  }, []);

  useLayoutEffect(() => {
    if (data.imgSelected) {
      cropper = new window.Cropper(uploadImgRef.current, {
        viewMode: 2,
        preview: `.${prefix}-clip-preview-target`
      });
    }
  }, [data.imgSelected]);

  const reset = () => {
    cropper.destroy();
    (uploadRef.current as HTMLInputElement).value = '';
    setData({
      ...data,
      imgSelected: false
    });
  };

  return (
    <Modal
      title={ult.clipModalTips?.title}
      visible={props.visible}
      onClosed={props.onCancel}
    >
      <div className={`${prefix}-form-item ${prefix}-clip`}>
        <div className={`${prefix}-clip-main`}>
          {data.imgSelected ? (
            <div className={`${prefix}-clip-cropper`}>
              <img src={data.imgSrc} ref={uploadImgRef} style={{ display: 'none' }} />
              <div className={`${prefix}-clip-delete`} onClick={reset}>
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-delete" />
                </svg>
              </div>
            </div>
          ) : (
            <div
              className={`${prefix}-clip-upload`}
              onClick={() => {
                (uploadRef.current as HTMLInputElement).click();
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-upload" />
              </svg>
            </div>
          )}
        </div>
        <div className={`${prefix}-clip-preview`}>
          <div className={`${prefix}-clip-preview-target`}></div>
        </div>
      </div>
      <div className={`${prefix}-form-item`}>
        <button
          className={`${prefix}-btn`}
          onClick={() => {
            const cvs = cropper.getCroppedCanvas();
            bus.emit(
              editorId,
              'uploadImage',
              [base642File(cvs.toDataURL('image/png'))],
              props.onOk
            );

            reset();
          }}
        >
          {ult.linkModalTips?.buttonOK}
        </button>
      </div>
      <input
        ref={uploadRef}
        accept="image/*"
        type="file"
        multiple={false}
        style={{ display: 'none' }}
      />
    </Modal>
  );
};

export default ClipModal;
