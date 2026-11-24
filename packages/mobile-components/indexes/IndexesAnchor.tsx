import React, { FC, useContext, useEffect, useRef } from 'react';
import cls from 'classnames';
import { StyledProps } from '../common';
import parseTNode from '../_util/parseTNode';
import { usePrefixClass } from '../hooks/useClass';
import { TdIndexesAnchorProps } from './type';
import { IndexesContext } from './IndexesContext';

export interface IndexesAnchorProps extends TdIndexesAnchorProps, StyledProps {
  children?: React.ReactNode;
}

const IndexesAnchor: FC<IndexesAnchorProps> = (props) => {
  const { children, index, className, style } = props;
  const indexesAnchorClass = usePrefixClass('indexes-anchor');
  const indexesAnchorRef = useRef<HTMLDivElement>(null);
  const { relation } = useContext(IndexesContext);

  useEffect(() => {
    relation(indexesAnchorRef.current, index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={cls(indexesAnchorClass, className)} style={style} ref={indexesAnchorRef} data-index={index}>
      <div className={`${indexesAnchorClass}__wrapper`}>
        <div className={`${indexesAnchorClass}__slot`}>{parseTNode(children)}</div>
        <div className={`${indexesAnchorClass}__header`}>{index}</div>
      </div>
    </div>
  );
};

IndexesAnchor.displayName = 'IndexesAnchor';

export default IndexesAnchor;
