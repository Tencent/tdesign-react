import React from 'react';
import { Button, Tooltip } from 'tdesign-react';

const styles = {
  container: {
    margin: '0 auto',
    width: '500px',
    height: '260px',
    position: 'relative',
  },
  placementTop: {
    position: 'absolute',
    top: '0',
    left: '42%',
  },
  placementTopLeft: {
    position: 'absolute',
    top: '0',
    left: '70px',
  },
  placementTopRight: {
    position: 'absolute',
    top: '0',
    right: '70px',
  },
  placementBottom: {
    position: 'absolute',
    bottom: '0',
    left: '42%',
  },
  placementBottomLeft: {
    position: 'absolute',
    bottom: '0',
    left: '70px',
    width: '120px',
  },
  placementBottomRight: {
    position: 'absolute',
    bottom: '0',
    right: '70px',
  },
  placementLeft: {
    position: 'absolute',
    left: '0',
    top: '42%',
  },
  placementLeftTop: {
    position: 'absolute',
    left: '0',
    top: '50px',
  },
  placementLeftBottom: {
    position: 'absolute',
    left: '0',
    bottom: '50px',
  },
  placementRight: {
    position: 'absolute',
    right: '0',
    top: '42%',
  },
  placementRightTop: {
    position: 'absolute',
    right: '0',
    top: '50px',
  },
  placementRightBottom: {
    position: 'absolute',
    right: '0',
    bottom: '50px',
  },
};

export default function Placements() {
  return (
    <div style={styles.container}>
      <Tooltip content="这是Tooltip内容" placement="top" showArrow destroyOnClose>
        <Button variant="outline" style={styles.placementTop}>
          top
        </Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容 top-left" placement="top-left" showArrow destroyOnClose>
        <Button variant="outline" style={styles.placementTopLeft}>
          top-left
        </Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容top-right" placement="top-right" showArrow destroyOnClose>
        <Button variant="outline" style={styles.placementTopRight}>
          top-right
        </Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容" placement="bottom" showArrow destroyOnClose>
        <Button variant="outline" style={styles.placementBottom}>
          bottom
        </Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容 bottom-left" placement="bottom-left" showArrow destroyOnClose>
        <Button variant="outline" style={styles.placementBottomLeft}>
          bottom-left
        </Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容 bottom-right" placement="bottom-right" showArrow destroyOnClose>
        <Button variant="outline" style={styles.placementBottomRight}>
          bottom-right
        </Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容" placement="left" showArrow destroyOnClose>
        <Button variant="outline" style={styles.placementLeft}>
          left
        </Button>
      </Tooltip>
      <Tooltip
        content="这是Tooltip内容   left-top"
        placement="left-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
      >
        <Button variant="outline" style={styles.placementLeftTop}>
          left-top
        </Button>
      </Tooltip>
      <Tooltip
        content="这是Tooltip内容 left-bottom"
        placement="left-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
      >
        <Button variant="outline" style={styles.placementLeftBottom}>
          left-bottom
        </Button>
      </Tooltip>
      <Tooltip content="这是Tooltip内容" placement="right" showArrow destroyOnClose>
        <Button variant="outline" style={styles.placementRight}>
          right
        </Button>
      </Tooltip>
      <Tooltip
        content="这是Tooltip内容 right-top"
        placement="right-top"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
      >
        <Button variant="outline" style={styles.placementRightTop}>
          right-top
        </Button>
      </Tooltip>
      <Tooltip
        content="这是Tooltip内容 right-bottom"
        placement="right-bottom"
        overlayStyle={{ width: '140px' }}
        showArrow
        destroyOnClose
      >
        <Button variant="outline" style={styles.placementRightBottom}>
          right-bottom
        </Button>
      </Tooltip>
    </div>
  );
}
