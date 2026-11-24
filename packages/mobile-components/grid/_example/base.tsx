import React from 'react';
import { Grid, GridItem } from 'tdesign-mobile-react';

const imgUrl = 'https://tdesign.gtimg.com/mobile/demos/example1.png';

export default function Base() {
  return (
    <>
      <Grid column={5} className={'grid-demo'}>
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="最多四个字" image={imgUrl} />
      </Grid>
      <Grid className={'grid-demo'}>
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="最多五个字" image={imgUrl} />
      </Grid>
      <Grid column={3} className={'grid-demo'}>
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="标题文字" image={imgUrl} />
        <GridItem text="最多六个文字" image={imgUrl} />
      </Grid>
    </>
  );
}
