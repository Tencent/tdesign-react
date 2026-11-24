interface Options {
  message?: string;
  format?: string; // MIME type
  onCopy?: (clipboardData: object) => void;
}

// inspired by https://github.com/sudodoki/toggle-selection, refactor to esm
const deselectCurrent = () => {
  const selection = document.getSelection();
  if (!selection.rangeCount) {
    return () => {};
  }
  let active = document.activeElement as HTMLElement | null;

  const ranges: Range[] = [];
  for (let i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }

  const tagName = active?.tagName?.toUpperCase(); // toUpperCase handles XHTML
  switch (tagName) {
    case 'INPUT':
    case 'TEXTAREA':
      (active as HTMLElement).blur();
      break;

    default:
      active = null;
      break;
  }

  selection.removeAllRanges();
  return () => {
    if (selection.type === 'Caret') {
      selection.removeAllRanges();
    }

    if (!selection.rangeCount) {
      ranges.forEach((range) => {
        selection.addRange(range);
      });
    }

    if (active) {
      active.focus();
    }
  };
};

export const copy = (text: string, opts?: Options) => {
  const options: Options = opts || {};
  let reselectPrevious: (() => void) | undefined;
  let range: Range | undefined;
  let selection: Selection | null | undefined;
  let mark: HTMLSpanElement | undefined;
  let success = false;

  try {
    reselectPrevious = deselectCurrent();

    range = document.createRange();
    selection = document.getSelection();

    mark = document.createElement('span');
    mark.textContent = text;
    // reset user styles for span element
    mark.style.all = 'unset';
    // prevents scrolling to the end of the page
    mark.style.position = 'fixed';
    mark.style.top = '0';
    mark.style.clip = 'rect(0, 0, 0, 0)';
    // used to preserve spaces and line breaks
    mark.style.whiteSpace = 'pre';
    // do not inherit user-select (it may be `none`)
    mark.style.webkitUserSelect = 'text';
    mark.style.userSelect = 'text';
    mark.addEventListener('copy', (e: ClipboardEvent) => {
      e.stopPropagation();
      if (options.format) {
        e.preventDefault();
        e.clipboardData?.clearData();
        e.clipboardData?.setData(options.format, text);
      }
      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData as object);
      }
    });

    document.body.appendChild(mark);

    range.selectNodeContents(mark);
    selection?.addRange(range);

    const successful = document.execCommand('copy');
    if (!successful) {
      throw new Error('copy command was unsuccessful');
    }
    success = true;
  } catch {
    try {
      (window as any).clipboardData.setData(options.format || 'text', text);
      if (options.onCopy) {
        options.onCopy((window as any).clipboardData);
      }
      success = true;
    } catch {
      // 移动端不使用 prompt 兜底，静默失败
      console.warn('Copy to clipboard failed');
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange === 'function') {
        selection.removeRange(range as Range);
      } else {
        selection.removeAllRanges();
      }
    }

    if (mark) {
      document.body.removeChild(mark);
    }
    if (reselectPrevious) {
      reselectPrevious();
    }
  }

  return success;
};
