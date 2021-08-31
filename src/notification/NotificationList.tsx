import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useConfig from '../_util/useConfig';
import {
  NotificationInfoOptions,
  NotificationInstance,
  NotificationPlacementList,
  NotificationThemeList,
  TdNotificationProps,
} from '../_type/components/notification';
import { Styles } from '../_type/common';
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

type NotificationRef = React.RefObject<React.ElementRef<'div'>> & React.RefObject<NotificationInstance>;

let seed = 0;

export const listMap: Map<NotificationPlacementList, NotificationListInstance> = new Map();

const NotificationList = React.forwardRef<NotificationListInstance, NotificationListProps>((props, ref) => {
  const { attach, placement, zIndex } = props;
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
  const notificationMap = React.useMemo<Map<string, NotificationRef>>(() => new Map(), []);

  const remove = React.useCallback(
    (key: string): void => {
      dispatchList({ type: 'remove', key });
      notificationMap.delete(key);
    },
    [notificationMap],
  );

  /* eslint-disable implicit-arrow-linebreak */
  const push = React.useCallback(
    (theme: NotificationThemeList, options: NotificationInfoOptions): Promise<NotificationInstance> =>
      new Promise((resolve) => {
        const key = String((seed += 1));
        const style: React.CSSProperties = (() => {
          const offset = { top: 16, bottom: 16, left: 16, right: 16, ...options.offset };
          return {
            marginTop: `${offset.top}px`,
            marginBottom: `${offset.bottom}px`,
            marginLeft: `${offset.left}px`,
            marginRight: `${offset.right}px`,
          };
        })();
        notificationMap.set(key, React.createRef());
        dispatchList({ type: 'push', value: { ...options, key, theme, style } });
        notificationMap.get(key).current.close = () => {
          remove(key);
        };
        resolve(notificationMap.get(key).current);
      }),
    [notificationMap, remove],
  );

  const removeAll = React.useCallback(() => {
    dispatchList({ type: 'removeAll' });
    notificationMap.clear();
  }, [notificationMap]);

  React.useImperativeHandle(ref, () => ({
    push,
    remove,
    removeAll,
  }));

  React.useEffect(() => {
    if (list.length === 0 && notificationMap.size === 0) {
      listMap.delete(placement);
      ReactDOM.unmountComponentAtNode(attach);
      attach.remove();
    }
  }, [list, attach, placement, notificationMap]);

  return (
    <div className={`${classPrefix}-notification__show--${placement}`} style={{ zIndex }}>
      {list.map((props) => {
        const { onDurationEnd = noop, onCloseBtnClick = noop } = props;

        return (
          <NotificationComponent
            theme={'warning'}
            ref={notificationMap.get(props.key)}
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
