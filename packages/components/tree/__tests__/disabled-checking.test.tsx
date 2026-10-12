import React from 'react';
import { fireEvent, render, vi, waitFor } from '@test/utils';

import Tree from '../Tree';

import type { TreeProps } from '../Tree';

describe('Tree checking with disabled children', () => {
  const data = [
    {
      value: 'parent',
      label: 'Parent',
      children: [
        { value: 'a', label: 'A' },
        { value: 'b', label: 'B' },
        { value: 'disabled', label: 'Disabled', disabled: true },
      ],
    },
  ];

  async function setup(props: Partial<TreeProps> = {}) {
    const onChange = vi.fn();
    const result = render(<Tree data={data} checkable expandAll transition={false} onChange={onChange} {...props} />);
    await waitFor(() => expect(result.getAllByRole('checkbox')).toHaveLength(4));
    return {
      ...result,
      onChange,
      inputs: result.getAllByRole('checkbox') as HTMLInputElement[],
    };
  }

  const modes = [
    ['onlyLeaf', ['a', 'b']],
    ['all', ['parent', 'a', 'b']],
    ['parentFirst', ['parent']],
  ] as const;

  modes.forEach(([valueMode, expected]) => {
    it(`round-trips controlled values in ${valueMode} mode without checking disabled children`, async () => {
      const onChange = vi.fn();
      function ControlledTree() {
        const [value, setValue] = React.useState([]);
        return (
          <Tree
            data={data}
            checkable
            expandAll
            transition={false}
            valueMode={valueMode}
            value={value}
            onChange={(nextValue, context) => {
              onChange(nextValue, context);
              setValue(nextValue);
            }}
          />
        );
      }
      const { getAllByRole } = render(<ControlledTree />);
      await waitFor(() => expect(getAllByRole('checkbox')).toHaveLength(4));
      const inputs = getAllByRole('checkbox');
      fireEvent.click(inputs[0]);
      expect(onChange.mock.lastCall[0]).toEqual(expected);
      await waitFor(() => expect(inputs[0]).toBeChecked());
      expect(inputs[3]).not.toBeChecked();
      fireEvent.click(inputs[0]);
      expect(onChange.mock.lastCall[0]).toEqual([]);
      await waitFor(() => expect(inputs[0]).not.toBeChecked());
    });

    it(`checks and unchecks the parent in ${valueMode} mode`, async () => {
      const { inputs, onChange } = await setup({ valueMode });
      fireEvent.click(inputs[0]);
      expect(onChange.mock.lastCall[0]).toEqual(expected);
      expect(onChange.mock.lastCall[1].node.value).toBe('parent');
      await waitFor(() => expect(inputs[0]).toBeChecked());
      expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
      expect(inputs[1]).toBeChecked();
      expect(inputs[2]).toBeChecked();
      expect(inputs[3]).not.toBeChecked();
      expect(inputs[3]).toBeDisabled();

      fireEvent.click(inputs[0]);
      expect(onChange.mock.lastCall[0]).toEqual([]);
      await waitFor(() => expect(inputs[0]).not.toBeChecked());
      expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
      expect(inputs[1]).not.toBeChecked();
      expect(inputs[2]).not.toBeChecked();
    });

    it(`derives full and partial selection from enabled children in ${valueMode} mode`, async () => {
      const { inputs, onChange } = await setup({ valueMode });
      fireEvent.click(inputs[1]);
      expect(onChange.mock.lastCall[0]).toEqual(['a']);
      await waitFor(() => expect(inputs[0].closest('label')).toHaveClass('t-is-indeterminate'));

      fireEvent.click(inputs[2]);
      expect(onChange.mock.lastCall[0]).toEqual(expected);
      await waitFor(() => expect(inputs[0]).toBeChecked());
      expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');

      fireEvent.click(inputs[1]);
      expect(onChange.mock.lastCall[0]).toEqual(['b']);
      await waitFor(() => expect(inputs[0].closest('label')).toHaveClass('t-is-indeterminate'));
      expect(inputs[0]).not.toBeChecked();
    });

    it(`does not automatically check a parent with only disabled children in ${valueMode} mode`, async () => {
      const { inputs, onChange } = await setup({
        valueMode,
        data: [
          {
            ...data[0],
            children: data[0].children.map((child) => ({
              ...child,
              disabled: true,
            })),
          },
        ],
      });
      expect(inputs[0]).not.toBeChecked();
      expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
      fireEvent.click(inputs[0]);
      expect(onChange.mock.lastCall[0]).toEqual([]);
      expect(inputs[0]).not.toBeChecked();
    });
  });

  it.each(['all', 'parentFirst'] as const)('preserves a selected disabled child in %s mode', async (valueMode) => {
    const { inputs, onChange } = await setup({
      valueMode,
      defaultValue: ['disabled'],
    });
    expect(inputs[0]).not.toBeChecked();
    expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
    expect(inputs[3]).toBeChecked();
    fireEvent.click(inputs[0]);
    expect(onChange.mock.lastCall[0]).toEqual(
      valueMode === 'all' ? ['parent', 'a', 'b', 'disabled'] : ['parent', 'disabled'],
    );
    await waitFor(() => expect(inputs[0]).toBeChecked());
    fireEvent.click(inputs[0]);
    expect(onChange.mock.lastCall[0]).toEqual(['disabled']);
    await waitFor(() => expect(inputs[0]).not.toBeChecked());
    expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
    expect(inputs[3]).toBeChecked();
  });

  it('excludes disabled branches and their descendants from parent selection', async () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tree
        checkable
        expandAll
        transition={false}
        valueMode="all"
        data={[
          {
            value: 'root',
            children: [
              { value: 'enabled' },
              {
                value: 'branch',
                disabled: true,
                children: [{ value: 'leaf' }],
              },
            ],
          },
        ]}
        onChange={onChange}
      />,
    );
    await waitFor(() => expect(getAllByRole('checkbox')).toHaveLength(4));
    const inputs = getAllByRole('checkbox');
    fireEvent.click(inputs[0]);
    expect(onChange.mock.lastCall[0]).toEqual(['root', 'enabled']);
    await waitFor(() => expect(inputs[0]).toBeChecked());
    expect(inputs[2]).not.toBeChecked();
    expect(inputs[3]).not.toBeChecked();
    expect(inputs[2]).toBeDisabled();
    expect(inputs[3]).toBeDisabled();
  });

  it('propagates full selection through nested enabled branches', async () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Tree
        checkable
        expandAll
        transition={false}
        valueMode="all"
        data={[{ value: 'root', label: 'Root', children: data }]}
        onChange={onChange}
      />,
    );
    await waitFor(() => expect(getAllByRole('checkbox')).toHaveLength(5));
    const inputs = getAllByRole('checkbox') as HTMLInputElement[];
    fireEvent.click(inputs[0]);
    expect(onChange.mock.lastCall[0]).toEqual(['root', 'parent', 'a', 'b']);
    await waitFor(() => expect(inputs[0]).toBeChecked());
    expect(inputs[1]).toBeChecked();
    expect(inputs[0].closest('label')).not.toHaveClass('t-is-indeterminate');
    expect(inputs[1].closest('label')).not.toHaveClass('t-is-indeterminate');
    expect(inputs[4]).not.toBeChecked();
  });

  it('keeps strict checking independent of child selection', async () => {
    const { inputs, onChange } = await setup({ checkStrictly: true });
    fireEvent.click(inputs[0]);
    expect(onChange.mock.lastCall[0]).toEqual(['parent']);
    await waitFor(() => expect(inputs[0]).toBeChecked());
    expect(inputs[1]).not.toBeChecked();
    expect(inputs[2]).not.toBeChecked();
    expect(inputs[3]).not.toBeChecked();
  });
});
