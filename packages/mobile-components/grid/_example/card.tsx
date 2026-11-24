import React from 'react';
import { Grid, GridItem } from 'tdesign-mobile-react';

const imgUrl = 'https://tdesign.gtimg.com/mobile/demos/example1.png';

export default function Card() {
  return (
    <>
      <Grid column={4} theme="card" className={'grid-demo'}>
        <GridItem text="标题文字" image={imgUrl} description="描述文字" />
        <GridItem text="标题文字" image={imgUrl} description="描述文字" />
        <GridItem text="标题文字" image={imgUrl} description="描述文字" />
        <GridItem text="最多六个文字" image={imgUrl} description="描述最多六字" />
      </Grid>
      <Grid column={2} theme="card" className={'grid-demo'}>
        <GridItem text="标题文字" layout="horizontal" image={imgUrl} description="描述文字" />
        <GridItem text="标题文字" layout="horizontal" image={imgUrl} description="描述文字" />
      </Grid>
    </>
  );
}
