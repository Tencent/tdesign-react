import React, { FC } from 'react';
import { UploadIcon } from 'tdesign-icons-react';
import useConfig from '../_util/useConfig';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import Button from '../button';

export interface UploadTriggerProps {
  onClick?: () => void;
}

const UploadTrigger: FC<UploadTriggerProps> = (props) => {
  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('upload');

  return (
    <div className={`${classPrefix}-upload__trigger`} onClick={props.onClick}>
      {props.children ? (
        props.children
      ) : (
        <Button icon={<UploadIcon />} variant="outline">
          {t(locale.triggerUploadText.fileInput)}
        </Button>
      )}
    </div>
  );
};

export default UploadTrigger;
