import React, { Component, createRef } from 'react';
import isFunction from 'lodash/isFunction';
import { StyledProps } from '../_type';
import { ScrollContainerElement } from '../_type/common';
import { TdAffixProps } from '../_type/components/affix';
import { getScrollContainer } from '../_util/dom';
import { ConfigContext } from '../config-provider';

export interface AffixProps extends TdAffixProps, StyledProps {}

class Affix extends Component<AffixProps> {
  scrollContainer: ScrollContainerElement;

  static defaultProps = {
    container: () => window,
  };

  state = {
    affixed: false,
  };

  ticking = false;
  containerHeight = 0;
  oldWidth = 0;
  oldHeight = 0;

  affixRef = createRef<HTMLDivElement>();
  affixWrapRef = createRef<HTMLDivElement>();

  handleScroll = () => {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        const affixEl = this.affixRef.current;
        const { offsetBottom, offsetTop, onFixedChange } = this.props;
        const { top } = this.affixWrapRef.current.getBoundingClientRect(); // top = 节点到页面顶部的距离，包含 scroll 中的高度
        let containerTop = 0; // containerTop = 容器到页面顶部的距离
        if (this.scrollContainer instanceof HTMLElement) {
          containerTop = this.scrollContainer.getBoundingClientRect().top;
        }
        let fixedTop: number | false;
        const calcTop = top - containerTop; // 节点顶部到 container 顶部的距离
        const calcBottom = containerTop + this.containerHeight - offsetBottom; // 计算 bottom 相对应的 top 值
        if (offsetTop !== undefined && calcTop <= offsetTop) {
          // top 的触发
          fixedTop = containerTop + offsetTop;
        } else if (offsetBottom !== undefined && top >= calcBottom) {
          // bottom 的触发
          fixedTop = calcBottom;
        } else {
          fixedTop = false;
        }

        if (fixedTop !== false) {
          affixEl.className = `${this.context.classPrefix}-affix`;
          affixEl.style.top = `${fixedTop}px`;
          affixEl.style.width = `${this.oldWidth}px`;
        } else {
          affixEl.removeAttribute('class');
          affixEl.removeAttribute('style');
        }
        this.setState((state) => ({ ...state, affixed: !!fixedTop }));
        if (isFunction(onFixedChange)) onFixedChange(!!fixedTop, { top: fixedTop });
        this.ticking = false;
      });
    }
    this.ticking = true;
  };

  calcInitValue = () => {
    // 获取当前可视的高度
    let containerHeight = 0;
    if (this.scrollContainer instanceof Window) {
      containerHeight = this.scrollContainer.innerHeight;
    } else {
      containerHeight = this.scrollContainer.clientHeight;
    }
    // 被包裹的子节点宽高
    const { clientWidth, clientHeight } = this.affixRef.current || {};
    this.oldWidth = clientWidth;
    this.oldHeight = clientHeight;
    this.containerHeight = containerHeight - clientHeight;

    this.handleScroll();
  };

  componentDidMount() {
    // 防止渲染未完成
    setTimeout(() => {
      const { container } = this.props;
      this.scrollContainer = getScrollContainer(container);
      if (!this.scrollContainer) return;
      this.calcInitValue();
      this.scrollContainer.addEventListener('scroll', this.handleScroll);
      window.addEventListener('resize', this.handleScroll);
    });
  }

  componentWillUnmount() {
    if (!this.scrollContainer) return;
    this.scrollContainer.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }

  render() {
    return (
      <div ref={this.affixWrapRef}>
        {this.state.affixed ? <div style={{ width: `${this.oldWidth}px`, height: `${this.oldHeight}px` }}></div> : ''}
        <div ref={this.affixRef}>{this.props.children}</div>
      </div>
    );
  }
}

Affix.contextType = ConfigContext;

export default Affix;
