import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import Modal from '~/components/Modal';
import bus from '~/utils/event-bus';
import { EditorContext } from '~/Editor';
import { configOption, prefix } from '~/config';
import { base642File } from '~/utils';
import Icon from '~/components/Icon';
import { ERROR_CATCHER, UPLOAD_IMAGE } from '~/static/event-name';

interface ClipModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (data?: any) => void;
}

let cropper: any = null;

const ClipModal = (props: ClipModalProps) => {
  const editorConext = useContext(EditorContext);
  const { editorId, usedLanguageText } = editorConext;

  const Cropper = configOption.editorExtensions.cropper!.instance;

  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadImgRef = useRef<HTMLImageElement>(null);

  // 预览框
  const previewTargetRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState({
    cropperInited: false,
    imgSelected: false,
    imgSrc: '',
    // 是否全屏
    isFullscreen: false
  });

  useEffect(() => {
    // 显示时构建实例及监听事件
    if (props.visible && !data.cropperInited) {
      window.Cropper = Cropper || window.Cropper;

      // 直接定义onchange，防止创建新的实例时遗留事件
      (uploadRef.current as HTMLInputElement).onchange = () => {
        if (!window.Cropper) {
          bus.emit(editorId, ERROR_CATCHER, {
            name: 'Cropper',
            message: 'Cropper is undefined'
          });
          return;
        }

        const fileList = (uploadRef.current as HTMLInputElement).files || [];

        if (fileList?.length > 0) {
          const fileReader = new FileReader();

          fileReader.onload = (e: any) => {
            setData((_data) => ({
              ..._data,
              imgSelected: true,
              imgSrc: e.target.result
            }));
          };

          fileReader.readAsDataURL(fileList[0]);
        }
      };
    }
  }, [props.visible, data.cropperInited, Cropper, editorId]);

  useEffect(() => {
    if (data.imgSrc) {
      cropper = new window.Cropper(uploadImgRef.current, {
        viewMode: 2,
        preview: `.${prefix}-clip-preview-target`
        // aspectRatio: 16 / 9,
      });
    }
  }, [data.imgSrc]);

  useEffect(() => {
    (previewTargetRef.current as HTMLImageElement)?.setAttribute('style', '');
  }, [data.imgSelected]);

  useEffect(() => {
    cropper?.destroy();
    (previewTargetRef.current as HTMLImageElement)?.setAttribute('style', '');

    if (uploadImgRef.current) {
      cropper = new window.Cropper(uploadImgRef.current, {
        viewMode: 2,
        preview: `.${prefix}-clip-preview-target`
        // aspectRatio: 16 / 9,
      });
    }
  }, [data.isFullscreen]);

  // 弹出层宽度
  const modalSize = useMemo(() => {
    return data.isFullscreen
      ? {
          width: '100%',
          height: '100%'
        }
      : {
          width: '668px',
          height: '392px'
        };
  }, [data.isFullscreen]);

  const reset = () => {
    cropper.clear();
    cropper.destroy();
    cropper = null;
    (uploadRef.current as HTMLInputElement).value = '';
    setData((_data) => ({
      ..._data,
      imgSrc: '',
      imgSelected: false
    }));
  };

  const onAdjust = useCallback((isFullscreen: boolean) => {
    setData((_data) => ({
      ..._data,
      isFullscreen
    }));
  }, []);

  return useMemo(() => {
    return (
      <Modal
        className={`${prefix}-modal-clip`}
        title={usedLanguageText.clipModalTips?.title}
        visible={props.visible}
        onClose={props.onCancel}
        showAdjust
        isFullscreen={data.isFullscreen}
        onAdjust={onAdjust}
        {...modalSize}
      >
        <div className={`${prefix}-form-item ${prefix}-clip`}>
          <div className={`${prefix}-clip-main`}>
            {data.imgSelected ? (
              <div className={`${prefix}-clip-cropper`}>
                <img
                  src={data.imgSrc}
                  ref={uploadImgRef}
                  style={{ display: 'none' }}
                  alt=""
                />
                <div className={`${prefix}-clip-delete`} onClick={reset}>
                  <Icon name="delete" />
                </div>
              </div>
            ) : (
              <div
                className={`${prefix}-clip-upload`}
                onClick={() => {
                  (uploadRef.current as HTMLInputElement).click();
                }}
              >
                <Icon name="upload" />
              </div>
            )}
          </div>
          <div className={`${prefix}-clip-preview`}>
            <div className={`${prefix}-clip-preview-target`} ref={previewTargetRef}></div>
          </div>
        </div>
        <div className={`${prefix}-form-item`}>
          <button
            className={`${prefix}-btn`}
            type="button"
            onClick={() => {
              if (cropper) {
                const cvs = cropper.getCroppedCanvas();
                bus.emit(
                  editorId,
                  UPLOAD_IMAGE,
                  [base642File(cvs.toDataURL('image/png'))],
                  props.onOk
                );

                reset();
              }
            }}
          >
            {usedLanguageText.linkModalTips?.buttonOK}
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
  }, [
    usedLanguageText.clipModalTips?.title,
    usedLanguageText.linkModalTips?.buttonOK,
    props.visible,
    props.onCancel,
    props.onOk,
    data.isFullscreen,
    data.imgSelected,
    data.imgSrc,
    onAdjust,
    modalSize,
    editorId
  ]);
};

export default ClipModal;
