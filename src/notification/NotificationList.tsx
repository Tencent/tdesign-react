import React, { forwardRef, useCallback, useRef, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';
import useConfig from '../_util/useConfig';
import {
  NotificationInfoOptions,
  NotificationInstance,
  NotificationPlacementList,
  NotificationThemeList,
  TdNotificationProps,
} from './type';
import { Styles } from '../common';
import noop from '../_util/noop';
import { NotificationComponent } from './Notification';

interface NotificationListInstance extends TdNotificationProps {
  push: (theme: NotificationThemeList, options: NotificationInfoOptions) => Promise<NotificationInstance>;
  remove: (key: string) => void;
  removeAll: () => void;
}

interface NotificationListOpenOption extends NotificationInfoOptions {
  key: string;
  theme: NotificationThemeList;
  style: Styles;
}

interface NotificationListProps {
  attach: HTMLElement;
  zIndex: number;
  placement: NotificationPlacementList;
}

let seed = 0;

export const listMap: Map<NotificationPlacementList, NotificationListInstance> = new Map();

const NotificationList = forwardRef<NotificationListInstance, NotificationListProps>((props, ref) => {
  const { placement, zIndex } = props;
  const { classPrefix } = useConfig();
  const [list, dispatchList] = React.useReducer(
    (
      state: NotificationListOpenOption[],
      action: {
        type: string;
        key?: string;
        value?: NotificationListOpenOption;
      },
    ) => {
      switch (action.type) {
        case 'push':
          return [...state, action.value];
        case 'remove':
          return state.filter((item) => item.key !== action.key).map((item) => item);
        case 'removeAll':
          return [];
        default:
          return state;
      }
    },
    [],
  );

  const notificationMap = useRef(new Map());

  const remove = useCallback(
    (key: string): void => {
      dispatchList({ type: 'remove', key });
      notificationMap.current.delete(key);
    },
    [notificationMap],
  );

  const calOffset = (offset: string | number) => {
    if (!offset) return '16px';
    return isNaN(Number(offset)) ? offset : `${offset}px`;
  };

  const push = (theme: NotificationThemeList, options: NotificationInfoOptions): Promise<NotificationInstance> =>
    new Promise((resolve) => {
      const key = String((seed += 1));
      const style: React.CSSProperties = (() => {
        if (Array.isArray(options.offset)) {
          const [horizontal, vertical] = [...options.offset];
          const horizontalOffset = calOffset(horizontal);
          const verticalOffset = calOffset(vertical);

          return {
            marginTop: verticalOffset,
            marginBottom: verticalOffset,
            marginLeft: horizontalOffset,
            marginRight: horizontalOffset,
          };
        }
        return {
          margin: '16px',
        };
      })();
      notificationMap.current.set(key, React.createRef());
      dispatchList({ type: 'push', value: { ...options, key, theme, style } });
      notificationMap.current.get(key).current.close = () => remove(key);
      resolve(notificationMap.current.get(key).current);
    });

  const removeAll = () => {
    dispatchList({ type: 'removeAll' });
    notificationMap.current.clear();
  };

  useImperativeHandle(ref, () => ({
    push,
    remove,
    removeAll,
  }));

  return (
    <div className={`${classPrefix}-notification__show--${placement}`} style={{ zIndex }}>
      {list.map((props) => {
        const { onDurationEnd = noop, onCloseBtnClick = noop } = props;

        return (
          <NotificationComponent
            ref={notificationMap.current.get(props.key)}
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
