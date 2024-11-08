'use client';
import { MdPreview } from 'md-editor-rt';
import { useAppSelector } from '@/hooks/store';
import { useLang } from '@/hooks/router';
import IzCatalog from '../Catalog';
// import { debounce, getRootOffset } from '@vavt/util';

import './index.scss';

interface IzPreviewContentProp {
  editorId: string;
  value: string;
  showCodeRowNumber?: boolean;
}

// const { hash } = location;

// const onHtmlChanged = debounce<string, void>(() => {
//   if (/^#/.test(hash)) {
//     const headingId = decodeURIComponent(hash.replace('#', ''));

//     if (headingId) {
//       const targetHeadDom = document.getElementById(headingId);

//       if (targetHeadDom) {
//         const scrollLength = getRootOffset(targetHeadDom).offsetTop - 10;

//         window.scrollTo({
//           top: scrollLength,
//           behavior: 'smooth',
//         });
//       }
//     }
//   }
// });

const IzPreviewContent = (props: IzPreviewContentProp) => {
  const { showCodeRowNumber = true } = props;
  const lang = useLang();
  const state = useAppSelector((s) => s.setting);

  return (
    <div className="container">
      <div className="doc">
        <div className="content">
          <MdPreview
            id={props.editorId}
            language={lang}
            theme={state.theme}
            value={props.value}
            previewTheme={state.previewTheme}
            showCodeRowNumber={showCodeRowNumber}
            codeTheme={state.codeTheme}
            // onHtmlChanged={onHtmlChanged}
          />
        </div>
        <IzCatalog editorId={props.editorId} />
      </div>
    </div>
  );
};

export default IzPreviewContent;
