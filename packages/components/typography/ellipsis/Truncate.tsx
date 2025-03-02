/**
 * LICENSE
 * https://github.com/pablosichert/react-truncate/blob/master/LICENSE.md
 *
 * ISC License
 *
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is
hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE
INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */
import React from 'react';
import { omit } from 'lodash-es';
import PropTypes from 'prop-types';

export type TruncateProps = {
  children: React.ReactNode;
  ellipsis: React.ReactNode;
  onTruncate: (truncated: boolean) => void;
  lines: number;
  trimWhitespace: boolean;
  width: number;
  className: string;
  lineClassName: string;
};

export type TruncateState = {
  targetWidth?: number;
};

export default class Truncate extends React.Component<TruncateProps, TruncateState> {
  static propTypes = {
    children: PropTypes.node,
    ellipsis: PropTypes.node,
    lines: PropTypes.oneOfType([PropTypes.oneOf([false]), PropTypes.number]),
    trimWhitespace: PropTypes.bool,
    width: PropTypes.number,
    onTruncate: PropTypes.func,
    className: PropTypes.string,
    lineClassName: PropTypes.string,
  };

  static defaultProps = {
    children: '',
    ellipsis: '...',
    lines: 1,
    trimWhitespace: false,
    width: 0,
    lineClassName: 'truncate-line',
  };

  elements: Record<string, HTMLElement>;

  replacedLinks: Array<Record<string, string>>;

  calculatedEllipsisWidth: boolean;

  canvasContext: CanvasRenderingContext2D;

  timeout: number;

  state: TruncateState = {};

  constructor(props: TruncateProps) {
    super(props);

    this.elements = {};
    this.replacedLinks = [];
    this.calculatedEllipsisWidth = false;
    this.canvasContext;
  }

  componentDidMount() {
    const {
      elements: { text },
      calcTargetWidth,
      onResize,
    } = this;

    const canvas = document.createElement('canvas');
    this.canvasContext = canvas.getContext('2d');

    calcTargetWidth(() => {
      // Node not needed in document tree to read its content
      if (text && text.parentNode) {
        text.parentNode.removeChild(text);
      }
    });

    window.addEventListener('resize', onResize);
  }

  componentDidUpdate(prevProps: TruncateProps) {
    // Render was based on outdated refs and needs to be rerun
    if (this.props.children !== prevProps.children) {
      this.forceUpdate();
    }

    // If the width prop has changed, recalculate size of contents
    if (this.props.width !== prevProps.width) {
      this.calcTargetWidth();
    }
  }

  componentWillUnmount() {
    const {
      elements: { ellipsis },
      onResize,
      timeout,
    } = this;

    if (ellipsis.parentNode && this.calculatedEllipsisWidth) {
      ellipsis.parentNode.removeChild(ellipsis);
    }

    window.removeEventListener('resize', onResize);
    window.cancelAnimationFrame(timeout);
  }

  extractReplaceLinksKeys = (content) => {
    const i = 0;
    this.replacedLinks = [];

    content.replace(/(<a[\s]+([^>]+)>((?:.(?!<\/a>))*.)<\/a>)/g, (...rest) => {
      const item = Array.prototype.slice.call(rest, 1, 4);
      item.key = `[${'@'.repeat(item[2].length - 1)}=${i + 1}]`;
      this.replacedLinks.push(item);

      // eslint-disable-next-line no-param-reassign
      content = content.replace(item[0], item.key);
    });

    return content;
  };

  restoreReplacedLinks = (content: string) => {
    this.replacedLinks.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      content = content.replace(item.key, item[0]);
    });

    return this.createMarkup(content) as unknown as string;
  };

  // Shim innerText to consistently break lines at <br/> but not at \n
  innerText = (node: HTMLElement) => {
    const div = document.createElement('div');
    const contentKey = 'innerText' in window.HTMLElement.prototype ? 'innerText' : 'textContent';

    const content = node.innerHTML.replace(/\r\n|\r|\n/g, ' ');
    div.innerHTML = this.extractReplaceLinksKeys(content);

    let text = div[contentKey];

    const test = document.createElement('div');
    test.innerHTML = 'foo<br/>bar';

    if (test[contentKey].replace(/\r\n|\r/g, '\n') !== 'foo\nbar') {
      div.innerHTML = div.innerHTML.replace(/<br.*?[/]?>/gi, '\n');
      text = div[contentKey];
    }

    return text;
  };

  onResize = () => {
    this.calcTargetWidth();
  };

  onTruncate = (didTruncate: boolean) => {
    const { onTruncate } = this.props;

    if (typeof onTruncate === 'function') {
      this.timeout = window.requestAnimationFrame(() => {
        onTruncate(didTruncate);
      });
    }
  };

  calcTargetWidth = (callback?: () => void) => {
    const {
      elements: { target },
      calcTargetWidth,
      canvasContext,
      props: { width },
    } = this;

    // Calculation is no longer relevant, since node has been removed
    if (!target) {
      return;
    }

    const targetWidth =
      width ||
      // Floor the result to deal with browser subpixel precision
      Math.floor(target.parentElement.getBoundingClientRect().width);

    // Delay calculation until parent node is inserted to the document
    // Mounting order in React is ChildComponent, ParentComponent
    if (!targetWidth) {
      return window.requestAnimationFrame(() => calcTargetWidth(callback));
    }

    const style = window.getComputedStyle(target);

    const font = [style['font-weight'], style['font-style'], style['font-size'], style['font-family']].join(' ');

    canvasContext.font = font;

    this.setState(
      {
        targetWidth,
      },
      callback,
    );
  };

  measureWidth = (text: string) => this.canvasContext.measureText(text).width;

  ellipsisWidth = (node: HTMLElement) => {
    this.calculatedEllipsisWidth = true;
    return node.offsetWidth;
  };

  trimRight = (text: string) => text.replace(/\s+$/, '');

  createMarkup = (str: string) => (
    <span className={this.props.lineClassName} dangerouslySetInnerHTML={{ __html: str }} />
  );

  getLines = () => {
    const {
      elements,
      props: { lines: numLines, ellipsis, trimWhitespace, lineClassName },
      state: { targetWidth },
      innerText,
      measureWidth,
      onTruncate,
      trimRight,
      renderLine,
      restoreReplacedLinks,
    } = this;

    const lines = [];
    const text = innerText(elements.text);

    const textLines = text.split('\n').map((line) => line.split(''));
    let didTruncate = true;
    const ellipsisWidth = this.ellipsisWidth(this.elements.ellipsis);

    for (let line = 1; line <= numLines; line++) {
      const textWords = textLines[0];

      // Handle newline
      if (textWords.length === 0) {
        lines.push();
        textLines.shift();
        line -= 1;
        continue;
      }

      let resultLine: string | React.JSX.Element = textWords.join('');
      if (measureWidth(resultLine) <= targetWidth) {
        if (textLines.length === 1) {
          // Line is end of text and fits without truncating
          didTruncate = false;

          resultLine = restoreReplacedLinks(resultLine);
          lines.push(resultLine);

          break;
        }
      }

      if (line === numLines) {
        // Binary search determining the longest possible line including truncate string
        const textRest = textWords.join('');

        let lower = 0;
        let upper = textRest.length - 1;

        while (lower <= upper) {
          const middle = Math.floor((lower + upper) / 2);

          const testLine = textRest.slice(0, middle + 1);

          if (measureWidth(testLine) + ellipsisWidth <= targetWidth) {
            lower = middle + 1;
          } else {
            upper = middle - 1;
          }
        }

        let lastLineText = textRest.slice(0, lower);

        if (trimWhitespace) {
          lastLineText = trimRight(lastLineText);

          // Remove blank lines from the end of text
          while (!lastLineText.length && lines.length) {
            const prevLine = lines.pop();

            lastLineText = trimRight(prevLine);
          }
        }

        if (lastLineText.substr(lastLineText.length - 2) === '][') {
          lastLineText = lastLineText.substring(0, lastLineText.length - 1);
        }

        lastLineText = lastLineText.replace(/\[@+$/, '');
        lastLineText = restoreReplacedLinks(lastLineText);

        resultLine = (
          <span className={`${lineClassName}-with-symbol`}>
            {lastLineText}
            {ellipsis}
          </span>
        );
      } else {
        // Binary search determining when the line breaks
        let lower = 0;
        let upper = textWords.length - 1;

        while (lower <= upper) {
          const middle = Math.floor((lower + upper) / 2);

          const testLine = textWords.slice(0, middle + 1).join('');

          if (measureWidth(testLine) <= targetWidth) {
            lower = middle + 1;
          } else {
            upper = middle - 1;
          }
        }

        // The first word of this line is too long to fit it
        if (lower === 0) {
          // Jump to processing of last line
          line = numLines - 1;
          continue;
        }

        resultLine = textWords.slice(0, lower).join('');

        resultLine = restoreReplacedLinks(resultLine);

        textLines[0].splice(0, lower);
      }

      lines.push(resultLine);
    }

    onTruncate(didTruncate);

    return lines.map(renderLine);
  };

  renderLine = (line: React.ReactNode, i: number, arr: Array<string>) => {
    const { lineClassName } = this.props;

    if (i === arr.length - 1) {
      return (
        <span className={`${lineClassName}-wrapper`} key={i}>
          {line}
        </span>
      );
    }
    const br = <br key={`${i}br`} />;
    if (line) {
      return [
        <span className={`${lineClassName}-wrapper`} key={i}>
          {line}
        </span>,
        br,
      ];
    }
    return br;
  };

  render() {
    const {
      elements: { target },
      props: { children, ellipsis, lines, ...spanProps },
      state: { targetWidth },
      getLines,
      onTruncate,
    } = this;

    let text: React.ReactNode;

    const mounted = !!(target && targetWidth);

    if (typeof window !== 'undefined' && mounted) {
      if (lines > 0) {
        text = getLines();
      } else {
        text = children;

        onTruncate(false);
      }
    }

    return (
      <span
        {...omit(spanProps, ['onTruncate', 'trimWhitespace', 'lineClassName'])}
        ref={(targetEl) => {
          this.elements.target = targetEl;
        }}
      >
        <span
          style={{
            display: 'block',
            maxWidth: spanProps.width > 0 ? `${spanProps.width}px` : 'unset',
          }}
        >
          {text}
        </span>
        <span
          ref={(textEl) => {
            this.elements.text = textEl;
          }}
        >
          {children}
        </span>
        <span
          ref={(ellipsisEl) => {
            this.elements.ellipsis = ellipsisEl;
          }}
          style={{
            position: 'fixed',
            visibility: 'hidden',
            top: 0,
            left: 0,
          }}
        >
          {ellipsis}
        </span>
      </span>
    );
  }
}
