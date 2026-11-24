import React, { FC, useContext, useEffect, useMemo, useRef, MouseEvent } from 'react';
import classNames from 'classnames';
import { CheckIcon, CloseIcon } from 'tdesign-icons-react';
import withNativeProps, { NativeProps } from '../_util/withNativeProps';
import parseTNode from '../_util/parseTNode';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import { TdStepItemProps } from './type';
import { stepItemDefaultProps } from './defaultProps';
import { StepsContext } from './StepsContext';

export enum StepItemStatusEnum {
  DEFAULT = 'default',
  PROCESS = 'process',
  FINISH = 'finish',
  ERROR = 'error',
}

export enum StepThemeEnum {
  DEFAULT = 'default',
  DOT = 'dot',
}

export interface StepItemProps extends TdStepItemProps, NativeProps {}

const StepItem: FC<StepItemProps> = (props) => {
  const { title, content, icon, status, children, titleRight, extra } = useDefaultProps(props, stepItemDefaultProps);

  const stepItemClass = usePrefixClass('step-item');
  const stepItemRef = useRef<HTMLDivElement>(null);

  const {
    childrenNodes,
    current,
    relation,
    removeRelation,
    onClickItem,
    currentStatus: stepsStatus,
    layout,
    readonly,
    theme,
    sequence,
  } = useContext(StepsContext);

  useEffect(() => {
    relation(stepItemRef.current);
    const stepItemCur = stepItemRef.current;
    return () => {
      removeRelation(stepItemCur);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const index = useMemo(() => childrenNodes.indexOf(stepItemRef.current), [childrenNodes]);
  const isLastChild = useMemo(
    () => index === (sequence === 'positive' ? childrenNodes.length - 1 : 0),
    [index, sequence, childrenNodes],
  );

  const dot = useMemo(() => theme === StepThemeEnum.DOT, [theme]);
  const currentStatus = useMemo(() => {
    if (status !== 'default') return status;
    if (index === +current) return stepsStatus;
    if (index < +current) return 'finish';
    return status;
  }, [index, current, stepsStatus, status]);

  const rootClassName = useMemo(
    () =>
      classNames(stepItemClass, `${stepItemClass}--${layout}`, {
        [`${stepItemClass}--default`]: readonly,
        [`${stepItemClass}--${currentStatus}`]: currentStatus,
      }),
    [stepItemClass, layout, readonly, currentStatus],
  );

  const iconWrapperClassName = useMemo(
    () => classNames(`${stepItemClass}__anchor`, `${stepItemClass}__anchor--${layout}`),
    [stepItemClass, layout],
  );
  const dotClassName = useMemo(
    () => classNames(`${stepItemClass}__dot`, `${stepItemClass}__dot--${currentStatus}`),
    [stepItemClass, currentStatus],
  );

  const iconContent = useMemo(() => parseTNode(icon), [icon]);

  const iconClassName = useMemo(
    () =>
      classNames({
        [`${stepItemClass}__icon`]: iconContent,
        [`${stepItemClass}__icon--${currentStatus}`]: iconContent,
        [`${stepItemClass}__circle`]: !iconContent && theme === StepThemeEnum.DEFAULT,
        [`${stepItemClass}__circle--${currentStatus}`]: !iconContent && theme === StepThemeEnum.DEFAULT,
      }),
    [stepItemClass, currentStatus, iconContent, theme],
  );
  const contentClassName = useMemo(
    () =>
      classNames(`${stepItemClass}__content`, `${stepItemClass}__content--${layout}`, {
        [`${stepItemClass}__content--last`]: isLastChild,
      }),
    [stepItemClass, layout, isLastChild],
  );

  const titleClassName = useMemo(
    () =>
      classNames(
        `${stepItemClass}__title`,
        `${stepItemClass}__title--${currentStatus}`,
        `${stepItemClass}__title--${layout}`,
      ),
    [stepItemClass, currentStatus, layout],
  );
  const descriptionClassName = useMemo(
    () =>
      classNames(
        `${stepItemClass}__description`,
        `${stepItemClass}__description--${currentStatus}`,
        `${stepItemClass}__description--${layout}`,
      ),
    [stepItemClass, currentStatus, layout],
  );
  const extraClassName = useMemo(
    () =>
      classNames(
        `${stepItemClass}__extra`,
        `${stepItemClass}__extra--${currentStatus}`,
        `${stepItemClass}__extra--${layout}`,
      ),
    [stepItemClass, currentStatus, layout],
  );
  const separatorClassName = useMemo(
    () =>
      classNames(
        `${stepItemClass}__line`,
        `${stepItemClass}__line--${currentStatus}`,
        `${stepItemClass}__line--${sequence}`,
        `${stepItemClass}__line--${layout}`,
        `${stepItemClass}__line--${theme}`,
      ),
    [stepItemClass, currentStatus, layout, sequence, theme],
  );

  const onStepClick = (e: MouseEvent<HTMLDivElement>) => {
    if (readonly) return;
    onClickItem(index, current, { e });
  };

  const renderIconContent = () => {
    if (iconContent) {
      return iconContent;
    }

    if (currentStatus === StepItemStatusEnum.ERROR) {
      return <CloseIcon />;
    }

    if (currentStatus === StepItemStatusEnum.FINISH) {
      return <CheckIcon />;
    }

    return index + 1;
  };

  return withNativeProps(
    props,
    <div ref={stepItemRef} className={rootClassName} onClick={onStepClick}>
      <div className={iconWrapperClassName}>
        {dot ? <div className={dotClassName}></div> : <div className={iconClassName}>{renderIconContent()}</div>}
      </div>
      <div className={contentClassName}>
        <div className={titleClassName}>
          {parseTNode(title)}
          {layout === 'vertical' && parseTNode(titleRight)}
        </div>
        <div className={descriptionClassName}>{parseTNode(content) || parseTNode(children)}</div>
        <div className={extraClassName}>{parseTNode(extra)}</div>
      </div>
      {!isLastChild && <div className={separatorClassName}></div>}
    </div>,
  );
};

StepItem.displayName = 'StepItem';

export default StepItem;
