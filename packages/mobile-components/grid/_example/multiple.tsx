import React from 'react';
import { Grid, GridItem } from 'tdesign-mobile-react';

const imgUrl = 'https://tdesign.gtimg.com/mobile/demos/example1.png';

export default function Multiple() {
  return (
    <Grid column={4} className="grid-demo">
      <GridItem text="标题文字" image={imgUrl} />
      <GridItem text="标题文字" image={imgUrl} />
      <GridItem text="标题文字" image={imgUrl} />
      <GridItem text="最多五个字" image={imgUrl} />
      <GridItem text="标题文字" image={imgUrl} />
      <GridItem text="标题文字" image={imgUrl} />
      <GridItem text="标题文字" image={imgUrl} />
      <GridItem text="最多五个字" image={imgUrl} />
    </Grid>
  );
}
