import React, { FC } from 'react';
import { UploadIcon } from 'tdesign-icons-react';
import useConfig from '../_util/useConfig';
import Button from '../button';

export interface UploadTriggerProps {
  onClick?: () => void;
}

const UploadTrigger: FC<UploadTriggerProps> = (props) => {
  const { classPrefix, locale } = useConfig();

  return (
    <div className={`${classPrefix}-upload__trigger`} onClick={props.onClick}>
      {props.children ? (
        props.children
      ) : (
        <Button icon={<UploadIcon />} variant="outline">
          {locale.upload.trigger.file}
        </Button>
      )}
    </div>
  );
};

export default UploadTrigger;
