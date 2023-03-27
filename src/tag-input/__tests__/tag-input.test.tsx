import { fireEvent, vi } from '@test/utils';
import { TagInput } from '..';
import { getTagInputValueMount } from './mount';

describe('TagInput Component', () => {
  const mockFn = vi.spyOn(HTMLSpanElement.prototype, 'getBoundingClientRect');
  mockFn.mockImplementation(() => ({ width: 20, x: 5, clientX: 5 }));

  it('events.drag: dragSort', () => {
    const defaultValue = ['Vue', 'React', 'Angular'];
    const onDragSort = vi.fn(() => {
      // 模拟顺序交换
      const tagBox = document.querySelectorAll('.t-input__prefix').item(0);
      const vueTag = document.querySelectorAll('.t-tag').item(0);
      const reactTag = document.querySelectorAll('.t-tag').item(1);
      const cloneReact = reactTag.cloneNode(true);
      tagBox.insertBefore(cloneReact, vueTag);
      tagBox.removeChild(reactTag);
    });
    const { container } = getTagInputValueMount(TagInput, { dragSort: true, value: defaultValue }, { onDragSort });

    fireEvent.dragStart(container.querySelectorAll('.t-tag').item(1), {
      dataTransfer: {
        currentIndex: 1,
        targetIndex: 0,
      },
    });

    fireEvent.dragOver(container.querySelectorAll('.t-tag').item(0), {
      dataTransfer: {
        currentIndex: 1,
        targetIndex: 0,
      },
    });
    expect(onDragSort).toHaveBeenCalled(1);
    expect(onDragSort.mock.calls[0][0].target).toEqual('Vue');
    expect(container.querySelectorAll('.t-tag').item(0).firstChild.title).toEqual('React');
  });
});
