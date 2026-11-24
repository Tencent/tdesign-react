import React from 'react';
import { Skeleton } from 'tdesign-mobile-react';

const grid = [
  [
    { width: '48px', height: '48px', borderRadius: '6px' },
    { width: '48px', height: '48px', borderRadius: '6px' },
    { width: '48px', height: '48px', borderRadius: '6px' },
    { width: '48px', height: '48px', borderRadius: '6px' },
    { width: '48px', height: '48px', borderRadius: '6px' },
  ],
  [
    { width: '48px', height: '16px', borderRadius: '3px' },
    { width: '48px', height: '16px', borderRadius: '3px' },
    { width: '48px', height: '16px', borderRadius: '3px' },
    { width: '48px', height: '16px', borderRadius: '3px' },
    { width: '48px', height: '16px', borderRadius: '3px' },
  ],
];

export default function GridSkeleton() {
  return (
    <div className="skeleton-demo--grid">
      <Skeleton rowCol={grid} loading={true} />
    </div>
  );
}
