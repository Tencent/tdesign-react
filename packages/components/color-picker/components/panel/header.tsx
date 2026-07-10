import React, { useCallback, useEffect, useRef, useState } from 'react';
import { COLOR_MODES } from '@tdesign/common-js/color-picker/constants';
import { isEyeDropperSupported, openEyeDropper } from '@tdesign/common-js/color-picker/eyedropper';
import { useLocaleReceiver } from '../../../locale/LocalReceiver';
import Radio from '../../../radio';
import type { RadioValue } from '../../../radio';
import type { TdColorModes } from '../../interface';
import type { TdColorPickerProps } from '../../type';

export interface ColorPanelHeaderProps extends TdColorPickerProps {
  mode?: TdColorModes;
  onModeChange?: (value: RadioValue, context: { e: React.ChangeEvent<HTMLInputElement> }) => void;
  baseClassName?: string;
  onEyeDropperPick?: (hex: string) => void;
}

const supported = isEyeDropperSupported();

const Header = (props: ColorPanelHeaderProps) => {
  const [local, t] = useLocaleReceiver('colorPicker');
  const { baseClassName, mode = 'monochrome', colorModes, onModeChange, eyeDropper, onEyeDropperPick } = props;
  const [picking, setPicking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  const handleEyeDropperClick = useCallback(async () => {
    if (picking || !supported) return;
    abortRef.current = new AbortController();
    setPicking(true);
    try {
      const hex = await openEyeDropper(abortRef.current.signal);
      if (hex) onEyeDropperPick?.(hex);
    } finally {
      setPicking(false);
      abortRef.current = null;
    }
  }, [picking, onEyeDropperPick]);

  const isSingleMode = colorModes?.length === 1;

  if (isSingleMode && !eyeDropper) return null;

  return (
    <div className={`${baseClassName}__head`}>
      {!isSingleMode && (
        <div className={`${baseClassName}__mode`}>
          <Radio.Group variant="default-filled" size="small" value={mode} onChange={onModeChange}>
            {Object.keys(COLOR_MODES).map((key) => (
              <Radio.Button key={key} value={key}>
                {t(local[COLOR_MODES[key]])}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      )}
      {eyeDropper && (
        <button
          className={[`${baseClassName}__eyedropper`, !supported && 't-is-disabled'].filter(Boolean).join(' ')}
          title={t(local.eyeDropper) || '吸色'}
          disabled={!supported || picking}
          onClick={handleEyeDropperClick}
          type="button"
        >
          <svg viewBox="0 0 16 16" width="1em" height="1em" fill="currentColor" aria-hidden="true">
            <path d="M13.354.646a2.207 2.207 0 0 0-3.121 0L8.75 2.129l-.604-.604a1 1 0 1 0-1.414 1.414l.25.25L1.47 9.2A2.5 2.5 0 0 0 .75 11v.25H.5a.5.5 0 0 0 0 1h.25V12.5a.5.5 0 0 0 1 0v-.25H2a2.5 2.5 0 0 0 1.8-.72l5.982-5.982.25.25a1 1 0 1 0 1.414-1.414l-.604-.604 1.483-1.483a2.207 2.207 0 0 0 0-3.121zM3.094 11.78A1.5 1.5 0 0 1 2 12.25H1.75v-.25A1.5 1.5 0 0 1 2.22 10.906L8 5.121l.879.879-5.785 5.78z"/>
          </svg>
        </button>
      )}
    </div>
  );
};

export default React.memo(Header);
