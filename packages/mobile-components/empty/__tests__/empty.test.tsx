import React from 'react';
import { describe, it, expect, render, screen } from '@test/utils';
import Empty from '../Empty';

describe('Empty', () => {
  describe(':props', () => {
    it(':without prop', () => {
      render(<Empty />);
      expect(document.querySelector('.t-empty')).toBeInTheDocument();
    });

    it(':description', () => {
      const description = 'No data found';
      render(<Empty description={description} />);
      expect(screen.getByText(description)).toBeInTheDocument();
    });

    it(':action', () => {
      const action = <button>Reload</button>;
      render(<Empty action={action} />);
      expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    });

    it(':image', () => {
      const image = 'path/to/image.png';
      render(<Empty image={image} />);
      expect(screen.getByRole('img')).toHaveAttribute('src', image);
    });

    it(':image ReactNode', () => {
      const image = <div>Image</div>;
      render(<Empty image={image} />);
      expect(screen.getByText('Image')).toBeInTheDocument();
    });

    it(':icon', () => {
      const icon = <div>Icon</div>;
      render(<Empty icon={icon} />);
      expect(screen.getByText('Icon')).toBeInTheDocument();
    });
  });
});
