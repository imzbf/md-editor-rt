import { useEffect, useState } from 'react';

const backTop = () => {
  document.documentElement.scroll({
    top: 0,
    behavior: 'smooth'
  });
};

const BackTop = () => {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      setScrollTop(document.documentElement.scrollTop);
    });
  }, []);

  return scrollTop > 20 ? (
    <div className="back-top" onClick={backTop}>
      <svg className="icon" aria-hidden="true">
        <use xlinkHref="#med-icon-top"></use>
      </svg>
    </div>
  ) : (
    <></>
  );
};

export default BackTop;
