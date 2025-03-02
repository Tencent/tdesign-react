/* eslint-disable */
import { render } from '@test/utils';
import React from 'react';

import Empty from '../index';

describe('Empty 组件测试', () => {
  test('size', async () => {
    const { container } = render(<Empty size="small" />);

    expect(container.querySelector('.t-empty.t-size-s')).not.toBeNull();
  });

  test('title', async () => {
    const { container } = render(<Empty title="title" />);

    expect(container.querySelector('.t-empty__title').innerHTML).toBe('title');
  });

  test('description', async () => {
    const { container } = render(<Empty description="description" />);

    expect(container.querySelector('.t-empty__description').innerHTML).toBe('description');
  });

  test('action', async () => {
    const { container } = render(<Empty action={<div>action</div>} />);

    expect(container.querySelector('.t-empty__action').innerHTML).toBe('<div>action</div>');
  });

  test('type', async () => {
    const { container } = render(<Empty type="success" />);
    const successIconPath =
      'M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42ZM46 24C46 36.1503 36.1503 46 24 46C11.8497 46 2 36.1503 2 24C2 11.8497 11.8497 2 24 2C36.1503 2 46 11.8497 46 24ZM21 32.8284L12.1716 24L15 21.1716L21 27.1716L33 15.1716L35.8284 18L21 32.8284Z';
    expect(container.querySelector('.t-empty__image').querySelector('path').getAttribute('d')).toBe(successIconPath);
  });

  test('image', async () => {
    const { container } = render(<Empty image={<div>image</div>} />);
    expect(container.querySelector('.t-empty__image').innerHTML).toBe('<div>image</div>');
  });
});
