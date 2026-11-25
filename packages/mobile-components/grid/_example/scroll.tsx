import React from 'react';
import { Grid, GridItem } from 'tdesign-mobile-react';

const imgUrl = 'https://tdesign.gtimg.com/mobile/demos/example1.png';

export default function Scroll() {
  return (
    <>
      <Grid column={0} className={'grid-demo'}>
        {Array.from({ length: 10 }, (_, index) => (
          <GridItem key={index} text="标题文字" image={imgUrl} />
        ))}
      </Grid>
    </>
  );
}
