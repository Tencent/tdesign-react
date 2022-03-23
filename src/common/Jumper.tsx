import React from 'react';
import { ChevronLeftIcon, RoundIcon, ChevronRightIcon } from 'tdesign-icons-react';
import useConfig from '../_util/useConfig';
import Button from '../button';
import { SizeEnum } from '../common';

export interface JumperProps {
  size?: SizeEnum;
  prevTitle?: string;
  currentTitle?: string;
  nextTitle?: string;
  onJumperClick: Function;
}

export default function Jumper(props: JumperProps) {
  const { classPrefix } = useConfig();

  const { prevTitle, currentTitle, nextTitle, onJumperClick, size = 'small' } = props;

  return (
    <div className={`${classPrefix}-jumper`}>
      <Button
        title={prevTitle}
        variant="text"
        size={size}
        shape="square"
        onClick={() => onJumperClick(-1)}
        icon={<ChevronLeftIcon />}
        className={`${classPrefix}-jumper__btn`}
      />

      <Button
        title={currentTitle}
        variant="text"
        size={size}
        shape="square"
        onClick={() => onJumperClick(0)}
        icon={<RoundIcon />}
        className={`${classPrefix}-jumper__btn`}
      />

      <Button
        title={nextTitle}
        variant="text"
        size={size}
        shape="square"
        onClick={() => onJumperClick(1)}
        icon={<ChevronRightIcon />}
        className={`${classPrefix}-jumper__btn`}
      />
    </div>
  );
}
