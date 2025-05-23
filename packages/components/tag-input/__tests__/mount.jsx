import React from 'react';
import { render } from '@test/utils';

// empty value
export function getTagInputDefaultMount(TagInput, props, events) {
  return render(
    <TagInput {...props} {...events}></TagInput>
  );
}

// with default value
export function getTagInputValueMount(TagInput, props, events) {
  const value = ['tdesign-vue', 'tdesign-react', 'tdesign-miniprogram', 'tdesign-mobile-vue', 'tdesign-mobile-react'];
  return render(
    <TagInput value={value} {...props} {...events}></TagInput>
  );
}
