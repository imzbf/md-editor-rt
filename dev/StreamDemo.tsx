import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MdPreview } from '~~/index';
import type { Theme } from './App';
import mdText from './data.md';

const SOURCE_TEXT = mdText as string;
const SOURCE_CHARS = Array.from(SOURCE_TEXT);
const TOTAL_LENGTH = SOURCE_CHARS.length;

const SPEED_PRESETS = [
  { label: '慢速 · 40字/s', value: 40 },
  { label: '标准 · 80字/s', value: 80 },
  { label: '快速 · 160字/s', value: 160 }
];

const DEFAULT_SPEED = 80;
const intervalFromSpeed = (speed: number) => Math.max(1, Math.floor(1000 / speed));

interface StreamDemoProps {
  theme?: Theme;
  previewTheme?: string;
  codeTheme?: string;
  lang?: string;
}

const StreamDemo: React.FC<StreamDemoProps> = ({
  theme = 'light',
  previewTheme,
  codeTheme,
  lang = 'zh-CN'
}) => {
  const [content, setContent] = useState('');
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const [speed, setSpeed] = useState(DEFAULT_SPEED);

  const timerRef = useRef<number | undefined>(undefined);
  const indexRef = useRef(0);
  const contentRef = useRef('');

  // Sync refs with state
  useEffect(() => {
    indexRef.current = index;
    contentRef.current = content;
  }, [index, content]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const stopStream = useCallback(() => {
    stopTimer();
    setRunning(false);
  }, [stopTimer]);

  const appendNextChar = useCallback(() => {
    const currentIndex = indexRef.current;

    if (currentIndex >= TOTAL_LENGTH) {
      stopStream();
      return;
    }

    const newContent = contentRef.current + SOURCE_CHARS[currentIndex];
    const nextIndex = currentIndex + 1;

    setContent(newContent);
    setIndex(nextIndex);

    if (nextIndex >= TOTAL_LENGTH) {
      stopStream();
    }
  }, [stopStream]);

  const startTimer = useCallback(() => {
    stopTimer();
    const interval = intervalFromSpeed(speed);
    timerRef.current = window.setInterval(() => {
      appendNextChar();
    }, interval);
  }, [speed, stopTimer, appendNextChar]);

  const resetStream = useCallback(() => {
    stopStream();
    setContent('');
    setIndex(0);
    indexRef.current = 0;
    contentRef.current = '';
  }, [stopStream]);

  const startStream = useCallback(() => {
    if (running) {
      return;
    }
    if (index === TOTAL_LENGTH) {
      resetStream();
      return;
    }

    setRunning(true);
    appendNextChar();

    if (index + 1 >= TOTAL_LENGTH) {
      return;
    }

    startTimer();
  }, [running, index, resetStream, appendNextChar, startTimer]);

  const skipAll = useCallback(() => {
    stopStream();
    setContent(SOURCE_TEXT);
    setIndex(TOTAL_LENGTH);
    indexRef.current = TOTAL_LENGTH;
    contentRef.current = SOURCE_TEXT;
  }, [stopStream]);

  const updateSpeed = useCallback(
    (nextSpeed: number) => {
      if (speed === nextSpeed) {
        return;
      }

      setSpeed(nextSpeed);

      if (running) {
        //
      }
    },
    [speed, running]
  );

  useEffect(() => {
    if (running && index < TOTAL_LENGTH) {
      startTimer();
    }
    return () => {
      stopTimer();
    };
  }, [speed, running, index, startTimer, stopTimer]);

  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return (
    <section className="stream-demo container">
      <header className="stream-demo__header">
        <h2>模拟流式输出</h2>
        <p>点击"播放"开始模拟，文本会逐字追加到预览区,可随时切换速度、暂停或跳过。</p>
      </header>
      <div className="stream-demo__controls" style={{ marginBlockStart: '14px' }}>
        <button className="btn" disabled={running} onClick={startStream}>
          播放
        </button>
        <button className="btn" disabled={!running} onClick={stopStream}>
          暂停
        </button>
        <button className="btn" onClick={resetStream}>
          重置
        </button>
        <button className="btn" onClick={skipAll}>
          快速完成
        </button>
      </div>
      <div className="stream-demo__speeds" style={{ marginBlockStart: '14px' }}>
        {SPEED_PRESETS.map((item) => (
          <button
            className={`btn ${speed === item.value ? 'btn-active' : ''}`}
            key={item.value}
            onClick={() => updateSpeed(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <MdPreview
        value={content}
        theme={theme}
        previewTheme={previewTheme}
        codeTheme={codeTheme}
        language={lang}
        showCodeRowNumber
      />
    </section>
  );
};

export default StreamDemo;
