import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { Collapse } from '..';

const { Panel } = Collapse;

const panelContent = '这部分是每个折叠面板折叠或展开的内容';

describe('Collapse', () => {
  describe('events', () => {
    test('onChange', async () => {
      const onChange = vi.fn();
      const CollapseTest = () => (
        <Collapse defaultExpandAll defaultValue={['default']} onChange={onChange}>
          <Panel header="这是一个折叠标题" value="default">
            {panelContent}
          </Panel>
        </Collapse>
      );
      const { container } = render(<CollapseTest />);

      const element = container.querySelector('.t-collapse-panel__header');
      expect(element).not.toBeNull();

      fireEvent.click(element);
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('scenarios', () => {
    test('defaultExpandAll with defaultValue toggles panel visibility', async () => {
      const CollapseTest = () => (
        <Collapse defaultExpandAll defaultValue={['default']}>
          <Panel header="这是一个折叠标题" value="default">
            {panelContent}
          </Panel>
        </Collapse>
      );
      const { container } = render(<CollapseTest />);

      const element = container.querySelector('.t-collapse-panel__header');
      expect(element).not.toBeNull();

      fireEvent.click(element);
      expect(document.querySelector('.t-collapse-panel__body--collapsed')).toBeNull();

      fireEvent.click(element);
      expect(document.querySelector('.t-collapse-panel__body--collapsed')).not.toBeNull();
    });
  });
});
