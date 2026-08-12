import './style/index.js';

import _AutoComplete from './AutoComplete';
import _HighlightOption from './HighlightOption';

import type { TdHighlightOptionProps } from './HighlightOption';

export type { AutoCompleteProps } from './AutoComplete';
export * from './type';

export type HighlightOptionProps = TdHighlightOptionProps;

export const AutoComplete = _AutoComplete;

export const HighlightOption = _HighlightOption;

export default AutoComplete;
