import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { render } from '../_util/react-render';
import useConfig from '../hooks/useConfig';
import {
  NotificationInfoOptions,
  NotificationInstance,
  NotificationPlacementList,
  NotificationThemeList,
  TdNotificationProps,
} from './type';
import { Styles } from '../common';
import noop from '../_util/noop';
import NotificationComponent from './Notification';

interface NotificationListInstance extends TdNotificationProps {
  push: (theme: NotificationThemeList, options: NotificationInfoOptions) => Promise<NotificationInstance>;
  remove: (key: string) => void;
  removeAll: () => void;
}

interface NotificationListOpenOption extends NotificationInfoOptions {
  id: string;
  key: string;
  theme: NotificationThemeList;
  style: Styles;
  ref: React.RefObject<NotificationInstance>;
}

interface NotificationListProps {
  attach: HTMLElement;
  zIndex: number;
  placement: NotificationPlacementList;
  renderCallback: Function;
}

let seed = 0;

export const listMap: Map<NotificationPlacementList, NotificationListInstance> = new Map();

export const NotificationRemoveContext = React.createContext<(key: string) => void>(noop);

const NotificationList = forwardRef<NotificationListInstance, NotificationListProps>((props, ref) => {
  const { placement, zIndex, renderCallback } = props;
  const { classPrefix } = useConfig();
  const [list, setList] = useState<NotificationListOpenOption[]>([]);

  const remove = (key: string) => {
    setList((oldList) => {
      const index = oldList.findIndex((item) => item.key === key);
      if (index !== -1) {
        const tempList = [...oldList];
        tempList.splice(index, 1);
        return [...tempList];
      }
      return oldList;
    });
  };

  const calOffset = (offset: string | number) => (isNaN(Number(offset)) ? offset : `${offset}px`);

  const push = (theme: NotificationThemeList, options: NotificationInfoOptions): Promise<NotificationInstance> => {
    const key = String((seed += 1));
    const [horizontal, vertical] = [...options.offset];
    const horizontalOffset = calOffset(horizontal);
    const verticalOffset = calOffset(vertical);

    const style: Styles = {
      top: verticalOffset,
      left: horizontalOffset,
      marginBottom: 16,
      position: 'relative',
    };
    const ref = React.createRef<NotificationInstance>();

    setList((oldList) => [
      ...oldList,
      {
        ...options,
        key,
        theme,
        style,
        ref,
        id: key,
      },
    ]);

    return new Promise((resolve) => {
      // setTimeout replace requestAnimationFrame
      // 在useEffect启动关闭Notification时，requestAnimationFrame可能会过早执行，导致ref.current为undefined
      setTimeout(() => {
        resolve(ref.current);
      }, 1000 / 60);
    });
  };

  const removeAll = () => setList([]);

  useImperativeHandle(ref, () => ({ push, remove, removeAll }));

  useEffect(() => {
    renderCallback({ push, remove, removeAll });
    // eslint-disable-next-line
  }, []);

  return (
    <NotificationRemoveContext.Provider value={remove}>
      <div className={`${classPrefix}-notification__show--${placement}`} style={{ zIndex }}>
        {list.map((props) => {
          const { onDurationEnd = noop, onCloseBtnClick = noop } = props;
          return (
            <NotificationComponent
              ref={props.ref}
              key={props.key}
              {...props}
              onDurationEnd={() => {
                remove(props.key);
                onDurationEnd();
              }}
              onCloseBtnClick={(e) => {
                remove(props.key);
                onCloseBtnClick(e);
              }}
            />
          );
        })}
      </div>
    </NotificationRemoveContext.Provider>
  );
});

// 判断多个Notification同时执行
let renderNotification = false;

export const fetchListInstance = (
  placement: NotificationPlacementList,
  attach: HTMLElement,
  zIndex: number,
): Promise<NotificationListInstance> =>
  new Promise((resolve) => {
    // Fix the bug of Notification triggered for the first time in React 18 concurrent mode
    function idle() {
      if (listMap.has(placement)) {
        resolve(listMap.get(placement));
        return;
      }
      if (!renderNotification) {
        renderNotification = true;
        render(
          <NotificationList
            attach={attach}
            placement={placement}
            zIndex={Number(zIndex)}
            renderCallback={(instance) => {
              renderNotification = false;
              listMap.set(placement, instance);
              resolve(instance);
            }}
          />,
          attach,
        );
        return;
      } // 循环执行，直到NotificationList的回调执行
      setTimeout(idle, 1000 / 60);
    }
    idle();
  });
