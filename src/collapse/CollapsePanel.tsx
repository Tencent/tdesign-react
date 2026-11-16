import React, { forwardRef, memo, useCallback, useContext, useEffect, useMemo } from 'react';
import cls from 'classnames';
import { ChevronDownIcon, ChevronUpIcon } from 'tdesign-icons-react';
import type { StyledProps } from '../common';
import type { TdCollapsePanelProps } from './type';
import { collapsePanelDefaultProps } from './defaultProps';
import { CollapseContext } from './CollapseContext';
import { Cell } from '../cell';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import parseTNode from '../_util/parseTNode';

export interface CollapsePanelProps extends TdCollapsePanelProps, StyledProps {}

const CollapsePanel = forwardRef<HTMLDivElement, CollapsePanelProps>((originProps, ref) => {
  const props = useDefaultProps(originProps, collapsePanelDefaultProps);
  const collapsePanelClass = usePrefixClass('collapse-panel');

  const {
    value,
    disabled,
    placement,
    expandIcon,
    children,
    headerLeftIcon,
    header,
    headerRightContent,
    className,
    style,
  } = props;

  const parent = useContext(CollapseContext);

  const isActive = useMemo(() => !!parent?.activeValue?.includes(value), [parent, value]);

  const handleClick = useCallback(
    ({ e }: { e: React.MouseEvent<HTMLDivElement> }) => {
      e?.stopPropagation();
      if (parent?.disabled || disabled) return;
      parent?.onPanelChange(value, { e });
    },
    [parent, value, disabled],
  );

  useEffect(() => {
    if (parent?.defaultExpandAll) {
      parent.onPanelChange(value, { e: null }, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderDefaultIcon = () => {
    if (placement === 'bottom') {
      return isActive ? <ChevronUpIcon /> : <ChevronDownIcon />;
    }
    return isActive ? <ChevronDownIcon /> : <ChevronUpIcon />;
  };

  const renderRightIcon = () => {
    const showIcon = expandIcon || parent?.expandIcon;
    const icon = showIcon === true ? renderDefaultIcon() : showIcon;
    return <div className={`${collapsePanelClass}__header-icon`}>{parseTNode(icon)}</div>;
  };

  /** 面板内容区， */
  const PanelContent = () => {
    const panelContent = parseTNode(children);
    // 当前面板处理折叠状态时，是否销毁面板内容
    if (props.destroyOnCollapse && !isActive) return null;

    return <div className={`${collapsePanelClass}__content`}>{panelContent}</div>;
  };

  return (
    <div
      ref={ref}
      className={cls({
        [`${collapsePanelClass}`]: true,
        [`${collapsePanelClass}--${placement}`]: true,
        [`${collapsePanelClass}--expanded`]: isActive,
        [`${collapsePanelClass}--disabled`]: parent?.disabled || disabled,
        [className]: className,
      })}
      style={{
        ...style,
      }}
    >
      <Cell
        className={cls(
          `${collapsePanelClass}__title`,
          `${collapsePanelClass}__header`,
          `${collapsePanelClass}__header--${placement}`,
          {
            [`${collapsePanelClass}__header--expanded`]: isActive,
          },
        )}
        leftIcon={headerLeftIcon}
        title={parseTNode(header)}
        note={parseTNode(headerRightContent)}
        rightIcon={renderRightIcon()}
        onClick={handleClick}
      />
      <div className={`${collapsePanelClass}__body`} style={{ gridTemplateRows: isActive ? '1fr' : '0fr' }}>
        <div className={`${collapsePanelClass}__inner`}>{PanelContent()}</div>
      </div>
    </div>
  );
});

CollapsePanel.displayName = 'CollapsePanel';

export default memo(CollapsePanel);
