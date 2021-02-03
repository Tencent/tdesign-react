import React from 'react';
import Button from '../button/Button';
import { Icon } from '../icon/Icon';
import noop from '../_util/noop';
import useConfig from '../_util/useConfig';
import { PopConfirmProps } from './PopConfirm';

const PopContent = (props: PopConfirmProps & { onClose?: () => void }) => {
  const { content, cancelText, confirmText, icon, theme, onCancel = noop, onConfirm = noop, onClose = noop } = props;
  const { classPrefix } = useConfig();

  let color = '';
  let iconName = '';

  if (typeof icon === 'string') {
    iconName = icon;
  } else {
    // theme 为 default 时不展示图标，否则根据 theme 的值设置图标颜色样式
    iconName = theme === 'default' ? '' : 'info-circle-filled';
  }

  switch (theme) {
    case 'warning': // 黄色
      color = '#FFAA00';
      break;
    case 'error':
      color = '#FF3E00'; // 红色
      break;
    default:
      color = '#0052D9'; // 蓝色
  }

  let iconComponent = null;

  // icon 是自定义组件实例，优先级最高
  if (React.isValidElement(icon)) {
    iconComponent = <i style={{ color }}>{icon}</i>;
    // icon 是自定义组件类型
  } else if (typeof icon === 'function') {
    const CustomIcon = icon;
    iconComponent = <CustomIcon />;
    // icon 是 Icon 组件的 name
  } else if (iconName) {
    iconComponent = <Icon name={iconName} style={{ color }}></Icon>;
  }

  return (
    <div className={`${classPrefix}-popconfirm__content`}>
      <div className={`${classPrefix}-popconfirm__body`}>
        {iconComponent}
        <div className={`${classPrefix}-popconfirm__inner`}>{content}</div>
      </div>
      <div className={`${classPrefix}-popconfirm__buttons`}>
        <Button
          size="small"
          variant="text"
          style={{ color: '#222' }}
          onClick={(event) => {
            onCancel(event);
            onClose();
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={(event) => {
            onConfirm(event);
            onClose();
          }}
          size="small"
          variant="text"
        >
          {confirmText}
        </Button>
      </div>
    </div>
  );
};

PopContent.displayName = 'PopContent';

export default PopContent;
