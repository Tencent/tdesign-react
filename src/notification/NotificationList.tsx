import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';
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
}

let seed = 0;

export const listMap: Map<NotificationPlacementList, NotificationListInstance> = new Map();

export const NotificationRemoveContext = React.createContext<(key: string) => void>(noop);

const NotificationList = forwardRef<NotificationListInstance, NotificationListProps>((props, ref) => {
  const { placement, zIndex } = props;
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

  const calOffset = (offset: string | number) => {
    if (!offset) return '16px';
    return isNaN(Number(offset)) ? offset : `${offset}px`;
  };

  const push = (theme: NotificationThemeList, options: NotificationInfoOptions): Promise<NotificationInstance> => {
    const key = String((seed += 1));
    let style: React.CSSProperties = {
      margin: '16px',
    };
    if (Array.isArray(options.offset)) {
      const [horizontal, vertical] = [...options.offset];
      const horizontalOffset = calOffset(horizontal);
      const verticalOffset = calOffset(vertical);

      style = {
        marginTop: verticalOffset,
        marginBottom: verticalOffset,
        marginLeft: horizontalOffset,
        marginRight: horizontalOffset,
      };
    }
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

    return Promise.resolve(ref.current);
  };

  const removeAll = () => {
    setList([]);
  };

  useImperativeHandle(ref, () => ({
    push,
    remove,
    removeAll,
  }));

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

export const fetchListInstance = (
  placement: NotificationPlacementList,
  attach: HTMLElement,
  zIndex: number,
): Promise<NotificationListInstance> =>
  new Promise((resolve) => {
    if (listMap.has(placement)) {
      resolve(listMap.get(placement));
    } else {
      let hasExec = false;
      ReactDOM.render(
        <NotificationList
          attach={attach}
          placement={placement}
          zIndex={Number(zIndex)}
          ref={(instance) => {
            if (!hasExec) {
              hasExec = true;
              listMap.set(placement, instance);
              resolve(instance);
            }
          }}
        />,
        attach,
      );
    }
  });
