import React from 'react';
import { Skeleton } from 'tdesign-mobile-react';
import type { SkeletonProps } from 'tdesign-mobile-react';

const rowColsAvater: SkeletonProps['rowCol'] = [{ size: '48px', type: 'circle' }];
const rowColsImage: SkeletonProps['rowCol'] = [{ size: '48px', type: 'rect' }];
const rowColsContent: SkeletonProps['rowCol'] = [{ width: '50%' }, { width: '100%' }];

export default function CellGroupSkeleton() {
  return (
    <>
      <div className="cell-group">
        <Skeleton className="cell-group-avatar" rowCol={rowColsAvater} loading />
        <Skeleton className="cell-group-content" rowCol={rowColsContent} loading />
      </div>

      <div className="cell-group">
        <Skeleton className="cell-group-avatar" rowCol={rowColsImage} loading />
        <Skeleton className="cell-group-content" rowCol={rowColsContent} loading />
      </div>
    </>
  );
}
