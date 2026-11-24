import { TimeData } from '../../type';

export interface TimeItem {
  digit: string;
  unit: string;
  match: string;
}

/**
 * 将毫秒数time转化为倒计时
 * @param time 倒计时时间，毫秒单位
 * @param format 倒计时格式化字符串，例如：dd天hh小时mm分ss秒SSS毫秒，hh:mm:ss.SSS，hh:mm:ss
 */
export function transformTime(time: number, format: string) {
  const days = Math.floor(time / 86400000); // 日
  const hours = Math.floor((time % 86400000) / 3600000); // 小时
  const minutes = Math.floor((time % 3600000) / 60000); // 分
  const seconds = Math.floor((time % 60000) / 1000); // 秒
  const milliseconds = Math.floor(time % 1000); // 毫秒
  const obj = {
    'd+': days,
    'D+': days,
    'h+': hours,
    'H+': hours,
    'm+': minutes,
    'M+': minutes,
    's+': seconds,
    'S+': milliseconds,
  };
  const timeData: TimeData = { days, hours, minutes, seconds, milliseconds };
  const timeList: TimeItem[] = [];
  let timeText = format;
  for (const prop in obj) {
    if (new RegExp(`(${prop})`).test(timeText)) {
      timeText = timeText.replace(RegExp.$1, (match, offset, source) => {
        const numStr = `${(obj as any)[prop]}`;
        let digit = numStr;
        if (match.length > 1) {
          digit = (match.replace(new RegExp(match[0], 'g'), '0') + numStr).substring(numStr.length);
        }
        const unit = source.substr(offset + match.length);
        const last = timeList[timeList.length - 1];
        if (last) {
          const index = last.unit.indexOf(match);
          if (index !== -1) {
            last.unit = last.unit.substring(0, index);
          }
        }
        timeList.push({ digit, unit, match });
        return digit;
      });
    }
  }
  return { timeText, timeList, timeData };
}
