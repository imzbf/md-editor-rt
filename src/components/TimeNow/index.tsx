import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

const weekNames = {
  'en-US': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  'zh-CN': ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日']
};

const TimeNow = () => {
  const state = useSelector<StateType>((state) => state) as StateType;
  const [time, setTime] = useState(() => {
    return dayjs().format('YYYY/MM/DD HH:mm:ss');
  });

  const text = useMemo(() => {
    const lang: 'en-US' | 'zh-CN' = state.lang;

    const weekday = dayjs().day();

    return `${time} ${weekNames[lang][weekday > 0 ? weekday - 1 : 6]}`;
  }, [state.lang, time]);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(dayjs().format('YYYY/MM/DD HH:mm:ss'));
    }, 1_000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return <span>{text}</span>;
};

export default TimeNow;
