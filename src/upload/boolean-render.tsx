import React, { FC, Fragment, ReactNode } from 'react';

export interface BooleanRenderProps {
  falseRender?: () => ReactNode;
  boolExpression?: boolean;
}

const BooleanRender: FC<BooleanRenderProps> = (props) => {
  const { children, boolExpression, falseRender = () => null } = props;

  return <Fragment>{boolExpression ? children : falseRender()}</Fragment>;
};

export default BooleanRender;
