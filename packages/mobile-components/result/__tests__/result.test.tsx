import React, { type ComponentType } from 'react';
import { describe, expect, it, render } from '@test/utils';
import { InfoCircleIcon, CheckCircleIcon, CloseCircleIcon } from 'tdesign-icons-react';
import { Result } from '..';

const imgUrl = 'https://tdesign.gtimg.com/mobile/demos/avatar1.png';

/**
 * 将驼峰命名的图标组件名转换为 kebab-case 格式
 * @param iconName 图标组件名，如 AccessibilityFilledIcon
 * @returns kebab-case 格式的字符串，如 accessibility-filled
 */
function convertIconNameToKebabCase(iconName: string): string {
  // 移除末尾的 "Icon" 后缀
  const nameWithoutIcon = iconName.replace(/Icon$/, '');

  // 将驼峰命名转换为 kebab-case
  return nameWithoutIcon
    .replace(/([A-Z])/g, '-$1') // 在大写字母前添加连字符
    .toLowerCase() // 转换为小写
    .replace(/^-/, ''); // 移除开头的连字符
}

function getIconId(component: ComponentType) {
  const name = convertIconNameToKebabCase(component.displayName);
  return `t-icon-${name}`;
}

describe('Result', () => {
  describe('props', () => {
    it(':default', () => {
      const { container } = render(<Result />);
      const iconId = getIconId(InfoCircleIcon);
      expect(container.querySelector(`.${iconId}`)).not.toBe(null);
      expect(container.querySelector(`.t-result__title`)).toBe(null);
    });

    it(':description', () => {
      const { container } = render(<Result description="description" />);
      expect(container.querySelector(`.t-result__description`)).not.toBe(null);
    });

    it(':theme', () => {
      const themeMaps = ['success', 'warning', 'error', undefined, null] as const;
      const iconMaps = {
        default: InfoCircleIcon,
        success: CheckCircleIcon,
        warning: InfoCircleIcon,
        error: CloseCircleIcon,
      };

      function checkTheme(theme?: (typeof themeMaps)[number]) {
        const { container } = render(<Result theme={theme} />);
        const iconId = getIconId(iconMaps[theme || 'default']);
        if (theme === null) {
          expect(container.querySelector(`.${iconId}`)).toBe(null);
        } else {
          expect(container.querySelector(`.${iconId}`)).not.toBe(null);
        }
      }

      themeMaps.forEach(checkTheme);
    });

    it(':title', () => {
      const { container } = render(<Result title="title" />);
      expect(container.querySelector(`.t-result__title`)).not.toBe(null);
      expect(container.querySelector(`.t-result__title`).textContent).toBe('title');
    });

    it(':image', () => {
      const imageTestCase = [null, () => <div>image slot</div>, imgUrl];

      const iconId = getIconId(InfoCircleIcon);
      const { container } = render(<Result image={imageTestCase[0]} />);
      const { container: container2 } = render(<Result image={imageTestCase[1]} />);
      const { container: container3 } = render(<Result image={imageTestCase[2]} />);

      expect(container.querySelector(`.${iconId}`)).not.toBe(null);
      expect(container2.querySelector(`.${iconId}`)).toBe(null);
      expect(container3.querySelector(`.${iconId}`)).toBe(null);

      expect(container2.querySelector('.t-result__thumb').textContent).toBe('image slot');
      expect(container3.querySelector('.t-result__thumb img').getAttribute('src')).toBe(imgUrl);
    });
  });
});
