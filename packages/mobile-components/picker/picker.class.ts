import { defaultGlobalConfig } from '../config-provider/ConfigContext';
import { PickerColumn, PickerWheelConfig } from './type';
import { DEFAULT_WHEEL_CONFIG } from './constants';
import { KeysType } from '../common';
import { findIndexOfEnabledOption, limitNumberInRange } from './utils';
import { reconvertUnit } from '../_util/convertUnit';

export interface PickerOptions {
  defaultIndex?: number;
  keys?: KeysType;
  defaultPickerColumns?: PickerColumn;
  el: HTMLElement | HTMLDivElement | HTMLUListElement;
  onChange: (index: number) => void;
  wheelConfig?: Required<PickerWheelConfig>;
  prefixCls: string;
}

export function stopPropagation(event: Event) {
  event.stopPropagation();
}

export function preventDefault(event: Event, isStopPropagation?: boolean) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    // The event can be canceled, so we do so.
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}

const quartEaseOut = function (t: number, b: number, c: number, d: number) {
  let tempT = t;
  return -c * ((tempT = tempT / d - 1) * tempT * tempT * tempT - 1) + b;
};

/**
 * constant var
 */
export const DEFAULT_ITEM_HEIGHT = 40;
const DEFAULT_HOLDER_HEIGHT = 200;

/**
 * @name picker
 * @description 阻尼参数来源iscroll5，灵感来自mui.picker
 * @param {[HTMLDivElement]} el   [picker-item的DOM元素]
 * @param {[Function]} onChange   [发生change事件时候的回调]
 * @param {[Number]} defaultIndex [picker-item开始的索引值]
 */
class Picker {
  holder: HTMLElement | HTMLUListElement;

  options: PickerOptions;

  list: HTMLUListElement | null = null;

  elementItems: HTMLLIElement[] = [];

  height: number = DEFAULT_HOLDER_HEIGHT;

  curIndex = 0;

  itemClassName = '';

  itemSelectedClassName = '';

  itemHeight: number = DEFAULT_ITEM_HEIGHT;

  lastMoveTime = 0;

  lastMoveStart = 0;

  stopInertiaMove = false;

  startY = 0;

  isPicking = false;

  offsetYOfStartBound = 0;

  offsetYOfEndBound = 0;

  offsetY = 0;

  offsetYOfStart = 0;

  offsetYOfEnd = 0;

  curValue: string | null = '';

  onChange: (index: number) => void;

  itemGroupHeight: number;

  indicatorOffset: number;

  inertiaDuration: number;

  bounceDuration: number;

  transitionDuration: number;

  inertiaTimeThreshold: number;

  inertiaDistanceThreshold: number;

  boundOffset: number;

  pickerColumns: PickerColumn;

  prefixCls: string;

  constructor(options: PickerOptions) {
    if (!options.el) throw new Error('options el needed!');
    this.holder = options.el;
    this.pickerColumns = options.defaultPickerColumns;
    this.options = options;
    this.onChange = options.onChange;
    const wheelConfig = options.wheelConfig ?? DEFAULT_WHEEL_CONFIG;
    this.inertiaDuration = wheelConfig.inertiaDuration;
    this.bounceDuration = wheelConfig.bounceDuration;
    this.transitionDuration = wheelConfig.transitionDuration;
    this.inertiaTimeThreshold = wheelConfig.inertiaTimeThreshold;
    this.inertiaDistanceThreshold = wheelConfig.inertiaDistanceThreshold;
    this.boundOffset = wheelConfig.boundOffset;
    this.prefixCls = options.prefixCls ?? defaultGlobalConfig.classPrefix;

    this.init();
  }

  init(): void {
    // 惯性滚动
    this.initScrollParams();
    // item 样式
    this.setSelectedClassName();
    // 绑定事件
    this.bindEvent();
  }

  /**
   * @description 获取所有的列表DOM元素
   */
  updateItems(): void {
    this.elementItems = Array.from(this.holder?.querySelectorAll('li') || []);
    const itemLen = this.elementItems.length;
    this.offsetYOfEnd = -this.itemHeight * (itemLen - 3);
    this.offsetYOfEndBound = -(this.itemHeight * (itemLen - 3) + this.boundOffset);
  }

  /**
   * @description 初始化滚动参数
   */
  initScrollParams(): void {
    this.list = this.holder as HTMLUListElement;
    this.itemGroupHeight =
      +reconvertUnit(window.getComputedStyle(this.holder.parentElement).height) || DEFAULT_HOLDER_HEIGHT;
    this.elementItems = Array.from(this.holder.querySelectorAll('li'));
    this.itemHeight = this.holder.querySelector('li')
      ? +reconvertUnit(window.getComputedStyle(this.holder.querySelector('li')).height) || DEFAULT_ITEM_HEIGHT
      : DEFAULT_ITEM_HEIGHT;
    this.height = this.holder.offsetHeight || DEFAULT_HOLDER_HEIGHT;
    this.indicatorOffset = this.itemGroupHeight / 2 - this.itemHeight / 2;
    let curIndex = findIndexOfEnabledOption(this.pickerColumns, this.options.defaultIndex || 0, this.options.keys);
    this.itemClassName = `${this.prefixCls}-picker-item__item`;
    this.itemSelectedClassName = `${this.prefixCls}-picker-item__item--active`;
    this.startY = 0;
    this.isPicking = false;
    this.lastMoveTime = 0;
    this.lastMoveStart = 0;
    this.stopInertiaMove = false;
    this.curValue = this.elementItems[curIndex]?.textContent;
    Object.defineProperty(this, 'curIndex', {
      set: (value: number) => {
        curIndex = value;
        this.curValue = this.elementItems[value]?.textContent;
      },
      get() {
        return curIndex;
      },
    });

    const startOffsetY = this.indicatorOffset - this.curIndex * this.itemHeight;
    const itemLen = this.elementItems.length;
    this.setOffsetY(startOffsetY);
    this.offsetYOfStart = startOffsetY;
    this.offsetYOfEnd = this.indicatorOffset - (itemLen - 1) * this.itemHeight;
    this.offsetYOfStartBound = this.indicatorOffset + this.boundOffset;
    this.offsetYOfEndBound = this.indicatorOffset - (itemLen - 1) * this.itemHeight - this.boundOffset;
  }

  bindEvent(): void {
    this.holder.addEventListener('touchstart', (e) => this.touchStartHandler(e as TouchEvent), false);
    this.holder.addEventListener('touchmove', (e) => this.touchMoveHandler(e as TouchEvent), false);
    this.holder.addEventListener('touchend', (e) => this.touchEndHandler(e as TouchEvent), false);
    this.holder.addEventListener('touchcancel', (e) => this.touchEndHandler(e as TouchEvent), false);
  }

  touchStartHandler(event: TouchEvent): void {
    preventDefault(event, false);
    this.isPicking = true;
    if (!this.holder) return;
    if (this.list) this.list.style.transition = '';
    this.startY = event.changedTouches[0].pageY;
    this.offsetYOfStart = this.offsetY;
    // 更新惯性参数
    this.updateInertiaParams(event, true);
  }

  getCount() {
    return this.pickerColumns.length;
  }

  getRange(thresholdA = 0, thresholdB = 3) {
    const min = -(this.getCount() - thresholdA) * this.itemHeight;
    const max = thresholdB * this.itemHeight;
    return { min, max };
  }

  touchMoveHandler(event: TouchEvent): void {
    preventDefault(event, false);
    if (!this.isPicking || !this.holder) return;

    const endY = event.changedTouches[0].pageY;
    const dragRange = endY - this.startY;
    this.updateInertiaParams(event, false);

    const { min, max } = this.getRange(0, 5);
    const moveOffsetY = limitNumberInRange(this.offsetYOfStart + dragRange, min, max);
    this.setOffsetY(moveOffsetY);
  }

  touchEndHandler(event: TouchEvent): void {
    preventDefault(event, false);
    this.isPicking = false;
    if (!this.holder) return;
    const point = event.changedTouches[0];
    const nowTime = event.timeStamp || Date.now();
    // move time gap
    const moveTime = nowTime - this.lastMoveTime;
    const distance = point.pageY - this.lastMoveStart;
    // 超出一定时间不再惯性滚动
    if (
      moveTime > this.inertiaTimeThreshold ||
      Math.abs(distance) < this.inertiaDistanceThreshold ||
      !this.inertiaDuration
    ) {
      this.stopInertiaMove = false;
      this.endScroll();
      return;
    }

    const speed = Math.abs(distance / moveTime);
    let dist = this.offsetY + (speed / 0.005) * (distance < 0 ? -1 : 1);
    const { min, max } = this.getRange(3, 2);
    dist = limitNumberInRange(dist, min, max);

    if (dist === 0) {
      this.stopInertiaMove = false;
      this.endScroll();
      return;
    }
    this.scrollDist(nowTime, this.offsetY, dist, this.inertiaDuration);
  }

  /**
   * @description 更新惯性参数
   * @param event
   * @param isStart
   */
  updateInertiaParams(event: TouchEvent, isStart: boolean): void {
    const point = event.changedTouches[0];
    if (isStart) {
      this.lastMoveStart = point.pageY;
      this.lastMoveTime = event.timeStamp || Date.now();
    }
    this.stopInertiaMove = true;
  }

  /**
   * @description 根据计算的物理惯性距离滚动
   * @param now
   * @param startOffsetY
   * @param dist
   * @param duration
   */
  scrollDist(now: number, startOffsetY: number, dist: number, duration: number): void {
    this.stopInertiaMove = false;
    let start: any = null;
    const inertiaMove = (timestamp: number) => {
      if (this.stopInertiaMove) {
        return;
      }
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const newOffsetY = quartEaseOut(progress, startOffsetY, dist - startOffsetY, duration);
      this.setOffsetY(newOffsetY);
      if (progress > duration || newOffsetY > this.offsetYOfStartBound || newOffsetY < this.offsetYOfEndBound) {
        this.endScroll();
      } else {
        window.requestAnimationFrame(inertiaMove);
      }
    };
    window.requestAnimationFrame(inertiaMove);
  }

  /**
   * @description 更新picker，一般当数据变化需要ui更新的时候调用
   */
  update(options?: any): void {
    this.updateItems();
    const targetIndex = this.elementItems.findIndex((el: HTMLLIElement) => el.textContent === this.curValue);
    const updateIndex = targetIndex === -1 ? 0 : targetIndex;
    this.updateIndex(updateIndex, options);
  }

  /**
   * @description 更新picker索引，数据变化时调用
   * @param index
   * @param duration
   */
  updateIndex(index: number, options?: any): void {
    const realOptions = {
      duration: this.transitionDuration,
      isChange: true,
      ...options,
    };
    this.curIndex = index;
    this.setSelectedClassName();
    const moveOffsetY = this.indicatorOffset - index * this.itemHeight;
    if (this.list) {
      this.list.style.transform = `translate(0,${moveOffsetY}px) translateZ(0)`;
      this.list.style.transitionDuration = `${realOptions.duration}ms`;
      this.list.style.transitionTimingFunction = 'ease-out';
    }
    if (realOptions.isChange) {
      this.onChange(index);
    }
  }

  /**
   * @description 更新数据源
   */
  updateOptions(options: PickerColumn = []): void {
    this.pickerColumns = options;
  }

  /**
   * @description 获取当前索引
   */
  getCurIndex(): number {
    return this.curIndex;
  }

  /**
   * @description 适配3d， TBD
   * @param index
   */
  fix3d(index: number): void {
    for (let i = 0; i < this.elementItems.length; i++) {
      const deg = 25 * (-index + i);
      this.elementItems[i].style.transform = `rotateX(${deg}deg)`;
      this.elementItems[i].style.webkitTransform = `rotateX(${deg}deg)`;
    }
  }

  /**
   * @description 设置item样式
   */
  setSelectedClassName(): void {
    const regClass = new RegExp(this.itemClassName, 'i');
    const regSelected = new RegExp(this.itemSelectedClassName, 'i');
    this.elementItems.forEach((item, i) => {
      const tempItem = item;
      const itemClass = tempItem.className;
      if (itemClass === '' || !itemClass) {
        tempItem.className = this.itemClassName;
      } else {
        if (!regClass.test(itemClass)) {
          tempItem.classList.add(this.itemClassName);
        }
        if (regSelected.test(itemClass)) {
          tempItem.classList.remove(this.itemSelectedClassName);
        }
      }
      if (this.curIndex === i) {
        tempItem.classList.add(this.itemSelectedClassName);
      }
    });
  }

  /**
   * 设置当前picker的滚动位移
   * @param offsetY
   */
  setOffsetY(offsetY: number): void {
    this.offsetY = offsetY;
    if (this.list) {
      this.list.style.transform = `translate3d(0, ${offsetY}px, 0)`;
    }
  }

  /**
   * @description 结束滚动时的回调
   */
  endScroll(): void {
    if (this.stopInertiaMove) return;
    let curIndex = 0;
    if (this.offsetY > this.offsetYOfStartBound) {
      curIndex = 0;
      if (this.list) {
        this.list.style.transition = `${this.bounceDuration}ms ease-out`;
      }
    } else if (this.offsetY < this.offsetYOfEndBound) {
      curIndex = this.elementItems.length - 1;
      if (this.list) {
        this.list.style.transition = `${this.bounceDuration}ms ease-out`;
      }
    } else {
      if (this.list) {
        this.list.style.transition = `${this.bounceDuration}ms ease-out`;
      }
      curIndex = -Math.round((this.offsetY - this.indicatorOffset) / this.itemHeight);
      if (curIndex < 0) curIndex = 0;
      if (curIndex > this.elementItems.length - 1) curIndex = this.elementItems.length - 1;
    }

    curIndex = findIndexOfEnabledOption(this.pickerColumns, curIndex, this.options.keys);

    const offsetY = this.indicatorOffset - curIndex * this.itemHeight;
    this.setOffsetY(offsetY);
    if (curIndex !== this.curIndex) {
      // 防止事件重复触发
      this.curIndex = curIndex;
      this.setSelectedClassName();
      this.onChange(this.curIndex);
    }
  }

  destroy(): void {
    delete this.holder;
  }
}

export default Picker;
