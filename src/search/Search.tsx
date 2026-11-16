import React, { useState, useRef } from 'react';
import type { FC, CompositionEvent, MouseEvent, KeyboardEvent, FocusEvent, SyntheticEvent } from 'react';
import { CloseCircleFilledIcon, SearchIcon } from 'tdesign-icons-react';
import classNames from 'classnames';
import useDefault from '../_util/useDefault';
import useLengthLimit from '../hooks/useLengthLimit';
import parseTNode from '../_util/parseTNode';
import useConfig from '../hooks/useConfig';
import type { TdSearchProps } from './type';
import type { StyledProps } from '../common';
import { searchDefaultProps } from './defaultProps';
import { ENTER_REG } from '../_common/js/common';
import useDefaultProps from '../hooks/useDefaultProps';
import { usePrefixClass } from '../hooks/useClass';
import Cell from '../cell/Cell';

export interface SearchProps extends TdSearchProps, StyledProps {}

const Search: FC<SearchProps> = (props) => {
  const {
    clearable,
    clearTrigger,
    action,
    center,
    disabled,
    focus,
    leftIcon,
    maxcharacter,
    maxlength,
    placeholder,
    readonly,
    shape,
    value,
    resultList,
    onActionClick,
    onBlur,
    onChange,
    onClear,
    onFocus,
    onSubmit,
  } = useDefaultProps(props, searchDefaultProps);
  const [focusState, setFocus] = useState(focus);
  const inputRef = useRef(null);
  const composingRef = useRef(false);
  const [composingValue, setComposingValue] = useState('');
  const [searchValue, setSearchValue] = useDefault(value, '', onChange);
  const [showResultList, setShowResultList] = useState(false);

  const { classPrefix } = useConfig();
  const searchClass = usePrefixClass('search');

  const boxClasses = classNames(`${searchClass}__input-box`, `${searchClass}__input-box--${shape}`, {
    [`${classPrefix}-is-focused`]: focusState,
  });
  const inputClasses = classNames(`${classPrefix}-input__keyword`, {
    [`${searchClass}--center`]: center,
  });

  const resultMaxLength = !Number.isNaN(Number(maxlength)) ? Number(maxlength) : -1;
  const { getValueByLimitNumber } = useLengthLimit({
    value: searchValue,
    maxlength,
    maxcharacter,
  });

  const inputValueChangeHandle = (e: SyntheticEvent<HTMLInputElement>) => {
    const { value } = e.target as HTMLInputElement;
    setSearchValue(getValueByLimitNumber(value), { trigger: 'input-change', e });
  };

  const handleInput = (e: SyntheticEvent<HTMLInputElement>) => {
    setShowResultList(true);
    const { nativeEvent } = e as SyntheticEvent<HTMLInputElement> & {
      nativeEvent?: Event & { isComposing?: boolean; inputType?: string };
    };

    const { value } = e.target as HTMLInputElement;
    // 中文输入的时候 inputType 是 insertCompositionText，因此合成态时仅缓存值，不触发 onChange。
    const checkInputType = nativeEvent?.inputType && nativeEvent.inputType === 'insertCompositionText';
    if (composingRef.current || nativeEvent?.isComposing || checkInputType) {
      setComposingValue(value);
      return;
    }

    inputValueChangeHandle(e);
  };

  const handleClear = (e: MouseEvent<HTMLDivElement>) => {
    setSearchValue('', { trigger: 'clear', e });
    setFocus(true);
    onClear?.({ e });
  };

  const handleFocus = (e: FocusEvent<HTMLDivElement>) => {
    setFocus(true);
    onFocus?.({ value: searchValue, e });
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    setFocus(false);
    onBlur?.({ value: searchValue, e });
  };

  const handleCompositionstart = (e: CompositionEvent) => {
    composingRef.current = true;
    const {
      currentTarget: { value },
    } = e as CompositionEvent<HTMLInputElement>;
    setComposingValue(value);
  };

  const handleCompositionend = (e: CompositionEvent) => {
    if (composingRef.current) {
      composingRef.current = false;
      setComposingValue('');
      inputValueChangeHandle(e as CompositionEvent<HTMLInputElement>);
    }
  };

  const handleAction = (e: MouseEvent) => {
    onActionClick?.({ e });
  };

  const handleSearch = (e: KeyboardEvent<HTMLDivElement>) => {
    // 如果按的是 enter 键, 13是 enter
    if (ENTER_REG.test(e.code) || ENTER_REG.test(e.key)) {
      e.preventDefault();
      setShowResultList(false);
      onSubmit?.({ value: searchValue, e });
    }
  };

  const renderLeftIcon = () => {
    if (leftIcon === 'search') {
      return <SearchIcon />;
    }
    return parseTNode(leftIcon);
  };

  const renderClear = () => {
    if (clearable && searchValue && (clearTrigger === 'always' || (clearTrigger === 'focus' && focusState))) {
      return (
        <div className={`${searchClass}__clear`} onClick={handleClear}>
          <CloseCircleFilledIcon />
        </div>
      );
    }
    return null;
  };

  const renderAction = () => {
    if (action && searchValue) {
      return (
        <div className={`${searchClass}__search-action`} onClick={handleAction}>
          {parseTNode(action)}
        </div>
      );
    }
    return null;
  };

  const highlightSearchValue = (item: string, value: string) => {
    const parts = item.split(new RegExp(`(${value})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === value.toLowerCase() ? (
        <span key={index} className={`${searchClass}__result-item--highLight`}>
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  const handleSelectOption = (item: string, e: MouseEvent<HTMLDivElement>) => {
    setShowResultList(false);
    setSearchValue(getValueByLimitNumber(item), { trigger: 'option-click', e });
  };

  const renderResultList = () => {
    if (!showResultList || !resultList || resultList.length === 0) {
      return null;
    }

    return (
      <div className={`${searchClass}__result-list`}>
        {resultList.map((item, index) => (
          <Cell
            key={index}
            className={`${searchClass}__result-item`}
            onClick={(context) => handleSelectOption(item, context.e)}
            title={highlightSearchValue(item, searchValue)}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className={`${searchClass}`}>
        <div className={`${boxClasses}`}>
          {renderLeftIcon()}
          <input
            ref={inputRef}
            value={composingRef.current ? composingValue : searchValue}
            type="search"
            className={`${inputClasses}`}
            style={
              props.cursorColor ? ({ '--td-search-cursor-color': props.cursorColor } as React.CSSProperties) : undefined
            }
            autoFocus={focus}
            placeholder={placeholder}
            readOnly={readonly}
            disabled={disabled}
            maxLength={!maxcharacter && resultMaxLength > 0 ? resultMaxLength : undefined}
            onKeyDown={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={handleInput}
            onCompositionStart={handleCompositionstart}
            onCompositionEnd={handleCompositionend}
          />
          {renderClear()}
        </div>
        {renderAction()}
      </div>
      {renderResultList()}
    </div>
  );
};

Search.displayName = 'Search';

export default Search;
