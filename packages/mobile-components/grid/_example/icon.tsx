import React from 'react';
import { Grid, GridItem } from 'tdesign-mobile-react';
import { ShareIcon, StarIcon, DownloadIcon, EditIcon } from 'tdesign-icons-react';

export default function () {
  return (
    <>
      <Grid column={4} className={'grid-demo'}>
        <GridItem text="分享" image={<ShareIcon size={24} />} />
        <GridItem text="收藏0" image={<StarIcon size={24} />} />
        <GridItem text="保存" image={<DownloadIcon size={24} />} />
        <GridItem text="编辑" image={<EditIcon size={24} />} />
      </Grid>
    </>
  );
}
