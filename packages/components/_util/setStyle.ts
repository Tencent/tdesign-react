import { Styles } from '../common';

/**
 * 用于为 el 节点增加 styles
 * @param el HTMLElement
 * @param style Styles
 */
function setStyle(el: HTMLElement, styles: Styles): void {
  const keys = Object.keys(styles);
  keys.forEach((key) => {
    // eslint-disable-next-line no-param-reassign
    el.style[key] = styles[key];
  });
}

export default setStyle;
