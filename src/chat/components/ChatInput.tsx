import React from 'react';
import { SendIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import Button from '../../button';
import Textarea from '../../textarea/Textarea';
import useConfig from '../../hooks/useConfig';

const ChatInput = () => {
  const { classPrefix } = useConfig();

  const componentClass = `${classPrefix}-chat`;

  const stopBtn = false;
  return (
    <div className={`${componentClass}__footer__content`}>
      <div className={`${componentClass}__footer__textarea`}>
        <Textarea autosize={{ minRows: 1, maxRows: 5 }} placeholder='输入消息或"/"选择提示...'></Textarea>
        <div className={`${componentClass}__footer__textarea__icon`}>
          <Button
            className={classNames(
              `${componentClass}__footer__textarea__icon__default`,
              `${componentClass}__footer__textarea__icon--focus`,
            )}
            shape="circle"
            icon={<SendIcon />}
          ></Button>
        </div>
      </div>
      {stopBtn && (
        <div className={`${componentClass}__footer__stopbtn`}>
          <Button shape="circle" icon={<SendIcon />} />
        </div>
      )}
    </div>
  );
};

export default ChatInput;
