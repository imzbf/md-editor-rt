import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { NormalFooterToolbar } from 'md-editor-rt';
import { useLang } from '@/hooks/router';

const weekNames = {
  'en-US': [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  'zh-CN': [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ],
};

const TimeNow = () => {
  const lang = useLang();
  const [time, setTime] = useState(() => {
    return dayjs().format('YYYY/MM/DD HH:mm:ss');
  });

  const [isClient, setIsClient] = useState(false);

  const text = useMemo(() => {
    const weekday = dayjs().day();

    return `${time} ${weekNames[lang][weekday > 0 ? weekday - 1 : 6]}`;
  }, [lang, time]);

  useEffect(() => {
    setIsClient(true);
    const timerId = setInterval(() => {
      setTime(dayjs().format('YYYY/MM/DD HH:mm:ss'));
    }, 1_000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return isClient ? <NormalFooterToolbar>{text}</NormalFooterToolbar> : <></>;
};

export default TimeNow;
