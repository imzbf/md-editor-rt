import React, { useEffect, useRef, useState } from 'react';
import Modal from '../../components/Modal';
import { StaticTextDefaultValue } from '../../Editor';
import { prefix } from '../../config';
import { base642File } from '../../utils';
import bus from '../../utils/event-bus';

import './style.less';

interface ClipModalProp {
  visible: boolean;
  ult: StaticTextDefaultValue;
  onCancel: () => void;
  onOk: (data?: any) => void;
  to: HTMLElement;
}

export default (props: ClipModalProp) => {
  const { ult } = props;

  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadImgRef = useRef<HTMLImageElement>(null);

  const [data, setData] = useState({
    imgSelected: false,
    imgSrc: ''
  });

  let cropper: any = null;

  useEffect(() => {
    (uploadRef.current as HTMLInputElement).addEventListener('change', () => {
      const fileList = (uploadRef.current as HTMLInputElement).files || [];

      // 切换模式
      setData({
        ...data,
        imgSelected: true
      });

      if (fileList?.length > 0) {
        const fileReader = new FileReader();

        fileReader.onload = (e: any) => {
          setData({
            ...data,
            imgSrc: e.target.result
          });

          // nextTick(() => {
          cropper = new window.Cropper(uploadImgRef.current, {
            viewMode: 2,
            preview: `.${prefix}-clip-preview-target`
            // aspectRatio: 16 / 9,
          });
          // });
        };

        fileReader.readAsDataURL(fileList[0]);
      }
    });
  }, []);

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
      to={props.to}
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
