import type { SizeLimitObj, SizeUnit, SizeUnitArray } from '../type';
import { useLocaleReceiver } from '../../locale/LocalReceiver';

// 各个单位和 B 的关系
const SIZE_MAP = {
  B: 1,
  KB: 1024,
  MB: 1048576, // 1024 * 1024
  GB: 1073741824, // 1024 * 1024 * 1024
};

/**
 * 大小比较
 * @param fileSize 以B为单位
 * @param sizeLimit
 * @param unit 计算机计量单位
 */
function judgeIsSuitableSize(fileSize: number, sizeLimit: number, unit: SizeUnit) {
  // 以 KB 为单位进行比较
  const units: SizeUnitArray = ['B', 'KB', 'MB', 'GB'];
  const index = units.indexOf(unit);
  if (index === -1) {
    console.warn(`TDesign Upload Warn: \`sizeLimit.unit\` can only be one of ${units.join()}`);
  }
  return fileSize <= sizeLimit * SIZE_MAP[unit];
}

export default function useHandleLimit() {
  const [local, t] = useLocaleReceiver('upload');
  return handleSizeLimit;

  // eslint-disable-next-line
  function handleSizeLimit(fileSize: number = 0, rawSizeLimit: SizeLimitObj | number) {
    const sizeLimit: SizeLimitObj =
      typeof rawSizeLimit === 'number' ? { size: rawSizeLimit, unit: 'KB' } : rawSizeLimit;
    sizeLimit.unit = sizeLimit.unit.toUpperCase() as SizeUnit;
    const isSuitableSize = judgeIsSuitableSize(fileSize, sizeLimit.size, sizeLimit.unit);
    let errorMsg;
    if (!isSuitableSize) {
      errorMsg = sizeLimit.message
        ? t(sizeLimit.message, { sizeLimit: sizeLimit.size })
        : `${t(local.sizeLimitMessage, { sizeLimit: sizeLimit.size })} ${sizeLimit.unit}`;
    }
    return [isSuitableSize, errorMsg];
  }
}
