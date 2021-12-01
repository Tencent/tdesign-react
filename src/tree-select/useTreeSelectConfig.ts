import { useMemo } from 'react';
import classNames from 'classnames';
import useConfig from '../_util/useConfig';
import useCommonClassName from '../_util/useCommonClassName';
import { TdTreeSelectProps } from './type';
import { PopupProps } from '../popup';

const defaultPopupProps: PopupProps = {
  trigger: 'click',
  placement: 'bottom-left',
  overlayClassName: '',
  overlayStyle: (trigger) => ({
    width: `${trigger.offsetWidth}px`,
  }),
};

export interface TreeSelectConfigProps extends TdTreeSelectProps {
  visible: boolean;
}

export default function useTreeSelectConfig(props: TreeSelectConfigProps) {
  const { classPrefix: prefix } = useConfig();
  const CLASSNAMES = useCommonClassName();

  const { disabled, prefixIcon, size, visible, popupProps } = props;

  return useMemo(() => {
    const selectClassName = classNames(`${prefix}-select`, {
      [CLASSNAMES.STATUS.disabled]: disabled,
      [CLASSNAMES.STATUS.active]: visible,
      [CLASSNAMES.SIZE[size]]: size,
      [`${prefix}-has-prefix`]: prefixIcon,
    });

    const popupObject = Object.assign(defaultPopupProps, popupProps);

    const popupClassName = classNames(popupObject.overlayClassName, `${prefix}-select-dropdown`, 'narrow-scrollbar');

    return {
      selectClassName,
      popupClassName,
      popupObject,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefix, size, prefixIcon, disabled, visible, popupProps]);
}
