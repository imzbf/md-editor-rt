import {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import Dropdown from '~/components/Dropdown';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE, UPLOAD_IMAGE } from '~/static/event-name';
import { classnames } from '~/utils';
import { ToolDirective } from '~/utils/content-help';
import bus from '~/utils/event-bus';
import Modals from '../../Modals';

const ToolbarImageDropdown = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    disabled
  } = useContext(EditorContext);

  const wrapperId = `${editorId}-toolbar-wrapper`;
  const [visible, setVisible] = useState(false);
  const [clipVisible, setClipVisible] = useState(false);

  // 上传控件
  const uploadRef = useRef<HTMLInputElement>(null);

  const uploadHandler = useCallback(() => {
    bus.emit(editorId, UPLOAD_IMAGE, Array.from(uploadRef.current?.files || []));
    // 清空内容，否则无法再次选取同一张图片
    (uploadRef.current as HTMLInputElement).value = '';
  }, [editorId]);

  const emitHandler = useCallback(
    (direct: ToolDirective, params?: unknown) => {
      if (disabled) return;

      bus.emit(editorId, REPLACE, direct, params);
    },
    [editorId, disabled]
  );

  const onCancel = useCallback(() => {
    setVisible(false);
  }, []);

  const onOk = useCallback(
    (data: any) => {
      if (data) {
        emitHandler('image', {
          desc: data.desc,
          url: data.url,
          transform: true
        });
      }
      setClipVisible(false);
    },
    [emitHandler]
  );

  const overlay = useMemo(() => {
    return (
      <ul
        className={`${prefix}-menu`}
        onClick={() => {
          setVisible(false);
        }}
        role="menu"
      >
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-image`}
          onClick={() => {
            emitHandler('image');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.imgTitleItem?.link}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-image`}
          onClick={() => {
            uploadRef.current?.click();
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.imgTitleItem?.upload}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-image`}
          onClick={() => {
            setClipVisible(true);
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.imgTitleItem?.clip2upload}
        </li>
      </ul>
    );
  }, [
    emitHandler,
    ult.imgTitleItem?.clip2upload,
    ult.imgTitleItem?.link,
    ult.imgTitleItem?.upload
  ]);

  const child = useMemo(() => {
    return (
      <button
        className={classnames([
          `${prefix}-toolbar-item`,
          disabled && `${prefix}-disabled`
        ])}
        title={ult.toolbarTips?.image}
        disabled={disabled}
        type="button"
      >
        <Icon name="image" />
        {showToolbarName && (
          <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.image}</div>
        )}
      </button>
    );
  }, [disabled, showToolbarName, ult.toolbarTips?.image]);

  useEffect(() => {
    const uploadNode = uploadRef.current;
    uploadNode?.addEventListener('change', uploadHandler);

    return () => {
      uploadNode?.removeEventListener('change', uploadHandler);
    };
  }, [uploadHandler]);

  return (
    <>
      <label
        htmlFor={`${wrapperId}_label`}
        style={{ display: 'none' }}
        aria-label={ult.imgTitleItem?.upload}
      ></label>
      <input
        id={`${wrapperId}_label`}
        ref={uploadRef}
        accept="image/*"
        type="file"
        multiple={true}
        style={{ display: 'none' }}
      />
      <Modals clipVisible={clipVisible} onCancel={onCancel} onOk={onOk} />
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible}
        onChange={setVisible}
        disabled={disabled}
        overlay={overlay}
      >
        {child}
      </Dropdown>
    </>
  );
};

export default memo(ToolbarImageDropdown);
