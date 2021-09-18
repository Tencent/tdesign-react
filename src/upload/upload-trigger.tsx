import React, { FC } from 'react';
import useConfig from '../_util/useConfig';
import Button from '../button';
import UploadIcon from '../icon/icons/UploadIcon';

export interface UploadTriggerProps {
  onClick?: () => void;
}

const UploadTrigger: FC<UploadTriggerProps> = (props) => {
  const { classPrefix } = useConfig();

  return (
    <div className={`${classPrefix}-upload__trigger`} onClick={props.onClick}>
      {props.children ? (
        props.children
      ) : (
        <Button icon={<UploadIcon />} variant="outline">
          选择文件
        </Button>
      )}
    </div>
  );
};

export default UploadTrigger;
