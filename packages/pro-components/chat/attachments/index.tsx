import React, { forwardRef, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'tdesign-icons-react';

import { rootProps, useChatClass, useElementRef } from '../_util/native';
import { Filecard, isImage } from '../chat-filecard';

import type { TdAttachmentsProps } from '../_util/native-types';

export const Attachments = forwardRef<HTMLElement | undefined, TdAttachmentsProps>((props, ref) => {
  const { items, overflow = 'wrap', removable = true, imageViewer = true } = props;
  const list = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ previous: false, next: false });
  const update = () => {
    const el = list.current;
    if (el)
      setEdges({
        previous: el.scrollLeft > 1,
        next: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
      });
  };
  useEffect(() => {
    update();
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(update) : undefined;
    if (list.current) observer?.observe(list.current);
    return () => observer?.disconnect();
  }, [items, overflow]);
  const move = (direction: number) => {
    const el = list.current;
    if (el)
      el.scrollTo({
        left: el.scrollLeft + direction * el.clientWidth,
        behavior: 'smooth',
      });
  };
  const allImages = items.every(isImage);
  return (
    <div
      ref={useElementRef(ref)}
      {...rootProps(props, useChatClass('attachments'))}
      data-td-chat="attachments"
      data-overflow={overflow}
    >
      <div ref={list} className={props.innerClass} style={props.innerStyle} onScroll={update}>
        {items.map((item, index) => (
          <Filecard
            key={item.key || `${item.name}-${index}`}
            item={item}
            cardType={allImages ? 'image' : 'file'}
            removable={removable}
            imageViewer={imageViewer}
            onRemove={props.onRemove}
            onFileClick={props.onFileClick}
          />
        ))}
      </div>
      {overflow === 'scrollX' && edges.previous && (
        <button data-td-chat-button="" type="button" aria-label="上一页附件" onClick={() => move(-1)}>
          <ChevronLeftIcon />
        </button>
      )}
      {overflow === 'scrollX' && edges.next && (
        <button data-td-chat-button="" type="button" aria-label="下一页附件" onClick={() => move(1)}>
          <ChevronRightIcon />
        </button>
      )}
    </div>
  );
});
Attachments.displayName = 'Attachments';
export default Attachments;
export type { TdAttachmentItem, TdAttachmentsProps } from '../_util/native-types';
