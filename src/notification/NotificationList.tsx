import * as React from 'react';
import * as ReactDOM from 'react-dom';
import useConfig from '../_util/useConfig';
import Notification, {
  NotificationPlacement,
  NotificationInstance,
  NotificationOpenOptions,
} from './Notification';

interface NotificationListInstance {
  push: (options: NotificationOpenOptions) => Promise<NotificationInstance>;
  remove: (key: string) => void;
  removeAll: () => void;
}

interface NotificationListOpenOption extends NotificationOpenOptions {
  key: string;
}

interface NotificationListProps {
  attach: HTMLElement;
  zIndex: number;
  placement: NotificationPlacement;
}

type NotificationRef = React.RefObject<React.ElementRef<'div'>> &
  React.RefObject<NotificationInstance>;

let seed = 0;

export const listMap: Map<
  NotificationPlacement,
  NotificationListInstance
> = new Map();

const NotificationList = React.forwardRef<
  NotificationListInstance,
  NotificationListProps
>((props, ref) => {
  const { attach, placement, zIndex } = props;
  const { classPrefix } = useConfig();
  const [list, dispatchList] = React.useReducer(
    (
      state: NotificationListOpenOption[],
      action: {
        type: string;
        key?: string;
        value?: NotificationListOpenOption;
      }
    ) => {
      switch (action.type) {
        case 'push':
          return [...state, action.value];
        case 'remove':
          return state
            .filter((item) => item.key !== action.key)
            .map((item) => item);
        case 'removeAll':
          return [];
        default:
          return state;
      }
    },
    []
  );
  const notificationMap = React.useMemo<Map<string, NotificationRef>>(
    () => new Map(),
    []
  );

  const push = React.useCallback(
    (options: NotificationOpenOptions): Promise<NotificationInstance> =>
      new Promise((resolve) => {
        const key = String((seed += 1));
        const style: React.CSSProperties = (() => {
          const offset = Object.assign(
            { top: 16, bottom: 16, left: 16, right: 16 },
            options.offset
          );
          return {
            marginTop: `${offset.top}px`,
            marginBottom: `${offset.bottom}px`,
            marginLeft: `${offset.left}px`,
            marginRight: `${offset.right}px`,
          };
        })();
        notificationMap.set(key, React.createRef());
        dispatchList({ type: 'push', value: { ...options, key, style } });
        resolve(notificationMap.get(key).current);
      }),
    [notificationMap]
  );

  const remove = React.useCallback(
    (key: string): void => {
      dispatchList({ type: 'remove', key });
      notificationMap.delete(key);
    },
    [notificationMap]
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
    <div
      className={`${classPrefix}-notification__show--${placement}`}
      style={{ zIndex }}
    >
      {list.map((props) => (
        <Notification
          ref={notificationMap.get(props.key)}
          key={props.key}
          {...props}
          close={() => remove(props.key)}
        />
      ))}
    </div>
  );
});

export const fetchListInstance = (
  placement: NotificationPlacement,
  attach: HTMLElement,
  zIndex: number
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
        attach
      );
    }
  });
