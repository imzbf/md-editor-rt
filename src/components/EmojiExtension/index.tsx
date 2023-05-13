import React, { useState } from 'react';
import { DropdownToolbar, InsertContentGenerator } from 'md-editor-rt';

import { emojis } from './data';

interface EmojiExtensionProp {
  onInsert: (generator: InsertContentGenerator) => void;
}

const EmojiExtension = (props: EmojiExtensionProp) => {
  const [state, setState] = useState({
    visible: false
  });

  const emojiHandler = (emoji: string) => {
    const generator: InsertContentGenerator = () => {
      return {
        targetValue: emoji,
        select: true,
        deviationStart: 0,
        deviationEnd: 0
      };
    };

    props.onInsert(generator);
  };

  const onChange = (visible: boolean) => {
    setState({
      visible
    });
  };

  return (
    <DropdownToolbar
      title="emoji"
      visible={state.visible}
      onChange={onChange}
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-emoji"></use>
        </svg>
      }
      overlay={
        <div className="emoji-container">
          <ol className="emojis">
            {emojis.map((emoji, index) => {
              return (
                <li
                  key={`emoji-${index}`}
                  onClick={() => {
                    emojiHandler(emoji);
                  }}
                >
                  {emoji}
                </li>
              );
            })}
          </ol>
        </div>
      }
    ></DropdownToolbar>
  );
};

export default EmojiExtension;
