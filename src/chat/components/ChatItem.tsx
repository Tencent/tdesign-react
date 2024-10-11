import React, { useMemo } from 'react';
import classNames from 'classnames';
import isString from 'lodash/isString';
import isArray from 'lodash/isArray';
import useConfig from '../../hooks/useConfig';
// import Text from './ChatContent';
import Skeleton from '../../skeleton/Skeleton';
import parseTNode from '../../_util/parseTNode';
import ChatItemProvider from './ChatItemProvider';

export type TdChatItemProps = any;

const ChatItem: React.FC<any> = (props) => {
  const {
    variant,
    avatar,
    name,
    datetime,
    textLoading,
    // movable,
    // operation
    content,
    role,
    showActions,
    actions,
  } = props;
  const { classPrefix } = useConfig();
  const COMPONENT_NAME = `${classPrefix}-chat`;

  const shownameDatetime = name || datetime;

  const contentClasses = useMemo(
    () =>
      classNames([
        `${COMPONENT_NAME}__content`,
        {
          [`${COMPONENT_NAME}__content--base`]: shownameDatetime,
        },
      ]),
    [shownameDatetime, COMPONENT_NAME],
  );

  const roleMemo = useMemo(() => ({ role }), [role]);

  const avatarDom = avatar ? (
    <div className={`${COMPONENT_NAME}__avatar`}>
      <div className={`${COMPONENT_NAME}__avatar__box`}>
        {isString(avatar) ? <img src={avatar} alt="" className={`${COMPONENT_NAME}__avatar-image`} /> : avatar}
      </div>
    </div>
  ) : null;

  const nameDatetimeDom = shownameDatetime && (
    <div className={`${COMPONENT_NAME}__base`}>
      {name && <span className={`${COMPONENT_NAME}__name`}>{name}</span>}
      {datetime && <span className={`${COMPONENT_NAME}__time`}>{datetime}</span>}
    </div>
  );

  let renderNode: React.ReactNode | null = null;

  if (role === 'model-change') {
    // modelChange 模式下，content支持html，样式有区分
    const modelChangeDom = (
      <div className={`${COMPONENT_NAME}__notice`} dangerouslySetInnerHTML={{ __html: content }}></div>
    );
    renderNode = <div className={`${COMPONENT_NAME}__inner model-change`}>{modelChangeDom}</div>;
  } else {
    renderNode = (
      <div className={`${COMPONENT_NAME}__inner  ${COMPONENT_NAME}__text--variant--${variant}`}>
        {avatarDom}
        <div className={contentClasses}>
          {nameDatetimeDom}
          {/* 骨架屏加载 */}
          {textLoading && <Skeleton loading={textLoading} animation={'gradient'}></Skeleton>}
          {/* 动画加载 skeleton：骨架屏 gradient：渐变加载动画一个点 dot：三个点 */}
          {/* {textLoading && movable && <ChatLoading loading={textLoading} animation={'gradient'}></ChatLoading>} */}
          {!textLoading && (
            <div className={`${COMPONENT_NAME}__detail`}>
              {/* 自定义content插槽内容 */}
              {isArray(content)
                ? content
                : // <Text isNormalText={false} content={content} role={role} />
                  null}
            </div>
          )}
          {role === 'assistant' && showActions && (
            <div className={`${COMPONENT_NAME}__actions-margin`}>{!!actions && parseTNode(actions)}</div>
          )}
        </div>
      </div>
    );
  }

  return <ChatItemProvider value={roleMemo}>{renderNode}</ChatItemProvider>;
};

export default ChatItem;
