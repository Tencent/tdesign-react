import React from 'react';
import { CopyIcon, RefreshIcon, ThumbDownIcon, ThumbUpIcon } from 'tdesign-icons-react';
import Tooltip from '../../tooltip';
import Button from '../../button';
import Space from '../../space';
import useConfig from '../../hooks/useConfig';

type OperationBtn = ['replay', 'copy', 'good', 'bad'];

interface TChatActionProps {
  isGood?: boolean;
  isBad?: boolean;
  content?: string;
  disabled?: boolean;
  operationBtn?: OperationBtn;
  onOperation?: (value: string, context: { e: MouseEvent }) => void;
}

const ChatAction: React.FC<TChatActionProps> = () => {
  const { classPrefix } = useConfig();

  const componentClass = `${classPrefix}-chat`;

  return (
    <div className={`${componentClass}__actions`}>
      <Space size={16}>
        <div className={`${componentClass}__refresh`}>
          <Tooltip content="重新生成">
            <Button>
              <RefreshIcon />
            </Button>
          </Tooltip>
          <span className={`${componentClass}__refresh-line`}></span>
        </div>
        <Tooltip content="复制">
          <Button>
            <CopyIcon />
          </Button>
        </Tooltip>
        <Tooltip content="点赞">
          <Button>
            <ThumbUpIcon />
          </Button>
        </Tooltip>
        <Tooltip content="点踩">
          <Button>
            <ThumbDownIcon />
          </Button>
        </Tooltip>
      </Space>
    </div>
  );
};

export default ChatAction;
