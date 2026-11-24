import React from 'react';
import { describe, expect, it, render } from '@test/utils';
import { Grid, GridItem } from '../index';
import { Image, ImageProps } from '../../image';

const prefix = 't';
const name = `${prefix}-grid`;
const imgUrl = 'https://tdesign.gtimg.com/mobile/%E5%9B%BE%E7%89%87.png';
const items = [
  {
    text: '标题',
    image: imgUrl,
    description: '内容 description',
  },
  {
    text: '标题',
    image: imgUrl,
    description: '内容 description',
  },
];

describe('Grid', () => {
  describe('props', () => {
    it('align', () => {
      const alignList = ['left', 'center', ''] as ('left' | 'center')[];
      alignList.forEach((align) => {
        const { container } = render(
          <Grid align={align}>
            <GridItem />
          </Grid>,
        );
        const $gridItem = container.querySelector(`.${name}-item`) as HTMLElement;
        if (align === 'left') {
          expect($gridItem.style.textAlign).toBe('left');
        } else {
          expect($gridItem.style.textAlign).toBe('center');
        }
      });
    });

    it('theme', () => {
      const themeList: ('default' | 'card')[] = ['default', 'card'];
      themeList.forEach((theme) => {
        const { container } = render(
          <Grid theme={theme}>
            <GridItem />
          </Grid>,
        );
        if (theme === 'card') {
          expect(container.querySelector(`.${name}--card`)).toBeTruthy();
        } else {
          expect(container.querySelector(`.${name}--card`)).toBeFalsy();
        }
      });
    });

    it('border', () => {
      const { container } = render(
        <Grid border>
          {items.map((item, index) => (
            <GridItem text={item.text + index} image={item.image} key={index} />
          ))}
        </Grid>,
      );
      const $gridItem = container.querySelectorAll(`.${name}-item`);
      $gridItem.forEach((item) => {
        expect(item.classList.contains(`${name}-item--bordered`)).toBeTruthy();
      });
    });

    it('column', () => {
      const columns = [3, 5];
      columns.forEach((column) => {
        const { container } = render(
          <Grid column={column}>
            {items.map((item, index) => (
              <GridItem text={item.text + index} image={item.image} key={index} />
            ))}
          </Grid>,
        );
        const $gridItem = container.querySelectorAll<HTMLElement>(`.${name}-item`);
        $gridItem.forEach((item) => {
          expect(item.style.flexBasis).toBe(`${100 / column}%`);
        });
      });
    });

    it('column = 0', () => {
      const { container } = render(
        <Grid column={0}>
          {items.map((item, index) => (
            <GridItem text={item.text + index} image={item.image} key={index} />
          ))}
        </Grid>,
      );
      expect(container.querySelector(`.${name}--auto-size`)).toBeTruthy();
    });

    it('gutter', () => {
      const gutter = 10;
      const { container } = render(
        <Grid gutter={gutter}>
          {items.map((item, index) => (
            <GridItem text={item.text + index} image={item.image} key={index} />
          ))}
        </Grid>,
      );
      const $grid = container.querySelector<HTMLElement>(`.${name}`);
      expect($grid.style.padding).toBe(`${gutter}px`);
      expect($grid.style.gridGap).toBe(`${gutter}px`);
    });
  });
});

describe('GridItem', () => {
  describe('props', () => {
    it('text', () => {
      const { container } = render(
        <Grid>
          {items.map((item, index) => (
            <GridItem text={item.text + index} key={index} />
          ))}
        </Grid>,
      );
      const $gridItem = container.querySelectorAll<HTMLElement>(`.${name}-item`);
      $gridItem.forEach((item, index) => {
        expect(item.querySelector(`.${name}-item__title`).textContent).toBe(items[0].text + index);
      });
    });

    it('image', () => {
      const imgProps: ImageProps = {
        src: imgUrl,
        shape: 'circle',
      };
      const { container } = render(
        <Grid>
          <GridItem image={imgProps} />
        </Grid>,
      );
      const $imgContainer = container.querySelector(`.${name}-item__image`);
      const $img = $imgContainer.querySelector('img');
      expect($img).toBeTruthy();
      expect($img.getAttribute('src')).toBe(imgUrl);
      expect($imgContainer.querySelector('.t-image--circle')).toBeTruthy();
    });

    it('image TNode', () => {
      const { container } = render(
        <Grid>
          <GridItem image={<Image src={imgUrl} />} />
        </Grid>,
      );
      const $imgContainer = container.querySelector(`.${name}-item__image`);
      const $img = $imgContainer.querySelector('img');
      expect($img).toBeTruthy();
      expect($img.getAttribute('src')).toBe(imgUrl);
    });

    it('description', () => {
      const { container } = render(
        <Grid>
          {items.map((item, index) => (
            <GridItem description={item.description + index} key={index} />
          ))}
        </Grid>,
      );
      const $gridItem = container.querySelectorAll<HTMLElement>(`.${name}-item`);
      $gridItem.forEach((item, index) => {
        expect(item.querySelector(`.${name}-item__description`).textContent).toBe(items[0].description + index);
      });
    });

    it('badge', () => {
      const { container } = render(
        <Grid>
          <GridItem badge={{ count: 1 }} />
        </Grid>,
      );
      const $badge = container.querySelector<HTMLElement>('.t-badge');
      expect($badge).toBeTruthy();
      // expect($badge.querySelector('.t-badge--basic').textContent).toBe('1'); // TODO 等待 badge 更新
    });

    it('layout', () => {
      const layoutList: ('horizontal' | 'vertical')[] = ['horizontal', 'vertical'];
      layoutList.forEach((layout) => {
        const { container } = render(
          <Grid>
            <GridItem layout={layout} />
          </Grid>,
        );
        const $gridItem = container.querySelector(`.${name}-item`);
        expect($gridItem.classList.contains(`${name}-item--${layout}`)).toBeTruthy();
      });
    });
  });
});
