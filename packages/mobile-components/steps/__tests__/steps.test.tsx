import React from 'react';
import { describe, expect, it, render, fireEvent, vi } from '@test/utils';
import { Icon } from 'tdesign-icons-react';
import { Steps, StepItem, StepStatus, Image } from 'tdesign-mobile-react';
import { StepsContext } from '../StepsContext';

const prefix = 't';
const steps = `${prefix}-steps`;
const stepItem = `${prefix}-step-item`;

const itemsWithTNode = [
  {
    title: '字符串标题',
    content: '字符串内容',
    status: 'default',
  },
  {
    title: <span>React元素标题</span>,
    content: <div>React元素内容</div>,
    status: 'process',
  },
  {
    title: () => <strong>函数标题</strong>,
    content: () => <em>函数内容</em>,
    status: 'finish',
  },
  {
    title: <span>React元素标题</span>,
    content: () => <em>函数内容</em>,
    status: 'error',
  },
];

describe('Steps', () => {
  describe('props', () => {
    it(':current', () => {
      const currentValues = [2, '2'] as const;

      function checkCurrent(current: (typeof currentValues)[number]) {
        const { container } = render(
          <Steps current={current}>
            <StepItem title="步骤1" />
            <StepItem title="步骤2" />
            <StepItem title="步骤3" />
            <StepItem title="步骤4" />
          </Steps>,
        );
        const $stepItems = container.querySelectorAll(`.${stepItem}`);
        expect($stepItems[0]).toHaveClass(`${stepItem}--finish`);
        expect($stepItems[1]).toHaveClass(`${stepItem}--finish`);
        expect($stepItems[2]).toHaveClass(`${stepItem}--process`);
        expect($stepItems[3]).toHaveClass(`${stepItem}--default`);
      }

      currentValues.forEach(checkCurrent);
    });

    it(':layout', () => {
      const layouts = ['horizontal', 'vertical'] as const;

      function checkLayout(layout: (typeof layouts)[number]) {
        const { container } = render(
          <Steps current={0} layout={layout}>
            {itemsWithTNode.map((item, index) => (
              <StepItem key={index} title={item.title} content={item.content} />
            ))}
          </Steps>,
        );
        expect(container.querySelector(`.${steps}`)).toHaveClass(`${steps}--${layout}`);
      }

      layouts.forEach(checkLayout);
    });

    it(':theme', () => {
      const themes = ['default', 'dot'] as const;

      function checkTheme(theme: (typeof themes)[number]) {
        const { container } = render(
          <Steps current={0} theme={theme}>
            {itemsWithTNode.map((item, index) => (
              <StepItem key={index} title={item.title} content={item.content} />
            ))}
          </Steps>,
        );
        const $stepItems = container.querySelectorAll(`.${stepItem}`);
        expect($stepItems.length).toEqual(itemsWithTNode.length);
        $stepItems.forEach((item) => {
          if (theme === 'dot') {
            expect(item.querySelector(`.${stepItem}__dot`)).toBeTruthy();
          } else {
            expect(item.querySelector(`.${stepItem}__circle`)).toBeTruthy();
          }
        });
      }

      themes.forEach(checkTheme);
    });

    it(':readonly', () => {
      const readonlyOptions = [true, false] as const;

      function checkReadonly(readonly: (typeof readonlyOptions)[number]) {
        const onClick = vi.fn();
        const { container } = render(
          <Steps current={0} readonly={readonly} onChange={onClick}>
            {itemsWithTNode.map((item, index) => (
              <StepItem key={index} title={item.title} content={item.content} />
            ))}
          </Steps>,
        );
        const $stepItems = container.querySelectorAll(`.${stepItem}`);
        fireEvent.click($stepItems[1]);

        if (readonly) {
          expect(onClick).toHaveBeenCalledTimes(0);
        } else {
          expect(onClick).toHaveBeenCalledTimes(1);
          expect(onClick).toHaveBeenCalledWith(
            1,
            0,
            expect.objectContaining({
              e: expect.objectContaining({ type: 'click' }),
            }),
          );
        }
      }

      readonlyOptions.forEach(checkReadonly);
    });

    it(':currentStatus', () => {
      const current = 1;
      const currentStatuses = ['default', 'process', 'finish', 'error'] as const;

      function checkCurrentStatus(currentStatus: (typeof currentStatuses)[number]) {
        const { container } = render(
          <Steps current={current} currentStatus={currentStatus} layout="vertical">
            {itemsWithTNode.map((item, index) => (
              <StepItem key={index} title={item.title} content={item.content} icon={<Icon name="cart" size="20px" />} />
            ))}
          </Steps>,
        );
        const $stepItems = container.querySelectorAll(`.${stepItem}`);
        const getStatus = (index) => {
          if (index < current) {
            return 'finish';
          }
          if (index === current) {
            return currentStatus;
          }
          return 'default';
        };
        $stepItems.forEach((item, index) => {
          expect(item.classList.contains(`${stepItem}--${getStatus(index)}`));
        });
      }

      currentStatuses.forEach(checkCurrentStatus);
    });

    it(':sequence', () => {
      const sequences = ['positive', 'reverse'] as const;

      function checkSequence(sequence: (typeof sequences)[number]) {
        const { container } = render(
          <Steps current={0} sequence={sequence}>
            {itemsWithTNode.map((item, index) => (
              <StepItem key={index} title={item.title} content={item.content} />
            ))}
          </Steps>,
        );
        const $stepItems = container.querySelectorAll(`.${stepItem}`);
        $stepItems.forEach((item, index) => {
          if (sequence === 'reverse') {
            if (index === 0) {
              expect(item.querySelector(`.${stepItem}__line`)).toBeNull();
            } else {
              expect(item.querySelector(`.${stepItem}__line`)).toBeTruthy();
            }
          } else if (index === $stepItems.length - 1) {
            expect(item.querySelector(`.${stepItem}__line`)).toBeNull();
          } else {
            expect(item.querySelector(`.${stepItem}__line`)).toBeTruthy();
          }
        });
      }

      sequences.forEach(checkSequence);
    });

    it('change steps', () => {
      const stepItems = [...itemsWithTNode];
      const { container, rerender } = render(
        <Steps current={0} sequence="reverse">
          {stepItems.map((item, index) => (
            <StepItem key={index} title={item.title} content={item.content} />
          ))}
        </Steps>,
      );
      stepItems.pop();
      rerender(
        <Steps current={0} sequence="reverse">
          {stepItems.map((item, index) => (
            <StepItem key={index} title={item.title} content={item.content} />
          ))}
        </Steps>,
      );
      expect(container.querySelectorAll(`.${stepItem}`).length).toEqual(stepItems.length);
    });
  });

  describe('events', () => {
    it(':onChange', () => {
      const onClick = vi.fn();
      const { container } = render(
        <Steps current={0} onChange={onClick}>
          {itemsWithTNode.map((item, index) => (
            <StepItem key={index} title={item.title} content={item.content} />
          ))}
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      fireEvent.click($stepItems[1]);
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(
        1,
        0,
        expect.objectContaining({
          e: expect.objectContaining({ type: 'click' }),
        }),
      );
    });
  });

  describe('edge cases', () => {
    it('should handle empty children', () => {
      const { container } = render(<Steps />);
      expect(container.querySelectorAll(`.${stepItem}`).length).toBe(0);
    });

    it('should handle single step', () => {
      const { container } = render(
        <Steps current={0}>
          <StepItem title="单一步骤" />
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      expect($stepItems.length).toBe(1);
      expect($stepItems[0].querySelector(`.${stepItem}__line`)).toBeNull();
    });

    it('should handle current out of bounds', () => {
      const { container } = render(
        <Steps current={5}>
          <StepItem title="步骤1" />
          <StepItem title="步骤2" />
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      expect($stepItems[0].classList.contains(`${stepItem}--finish`)).toBeTruthy();
      expect($stepItems[1].classList.contains(`${stepItem}--finish`)).toBeTruthy();
    });
  });

  describe('Steps relation function coverage', () => {
    it('should not add null element to childrenNodes', () => {
      const { container } = render(
        <Steps current={0}>
          <StepItem title="步骤1" />
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      expect($stepItems.length).toBe(1);
    });

    it('should handle edge cases in relation function', () => {
      const { container } = render(<Steps current={0} />);
      const $steps = container.querySelector(`.${steps}`);
      expect($steps).toBeTruthy();
    });

    it('should handle null ref in relation function', () => {
      const NullRefStepItem = () => null;
      const { container } = render(
        <Steps current={0}>
          <NullRefStepItem />
          <StepItem title="有效步骤" />
        </Steps>,
      );

      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      expect($stepItems.length).toBe(1);
    });

    it('should cover relation function when ele is null', () => {
      const TestRelationComponent = () => {
        const { relation } = React.useContext(StepsContext);

        React.useEffect(() => {
          relation(null);
        }, [relation]);

        return <div>Test</div>;
      };

      const { container } = render(
        <Steps current={0}>
          <TestRelationComponent />
        </Steps>,
      );

      expect(container.querySelector('.t-steps')).toBeTruthy();
    });

    it('should cover relation function when ele is undefined', () => {
      const TestRelationComponent = () => {
        const { relation } = React.useContext(StepsContext);

        React.useEffect(() => {
          relation(undefined);
        }, [relation]);

        return <div>Test</div>;
      };

      const { container } = render(
        <Steps current={0}>
          <TestRelationComponent />
        </Steps>,
      );

      expect(container.querySelector('.t-steps')).toBeTruthy();
    });

    it('should not add null or undefined to childrenNodes', () => {
      let relationFn;

      const TestCaptureComponent = () => {
        const context = React.useContext(StepsContext);
        relationFn = context.relation;
        return null;
      };

      render(
        <Steps current={0}>
          <TestCaptureComponent />
        </Steps>,
      );

      expect(() => {
        relationFn(null);
        relationFn(undefined);
      }).not.toThrow();
    });
  });
});

describe('StepItem', () => {
  describe('props', () => {
    it(':title & content', () => {
      const { container } = render(
        <Steps current={0} theme="dot" layout="vertical">
          {itemsWithTNode.map((item, index) => (
            <StepItem key={index} title={item.title} content={item.content} />
          ))}
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      expect($stepItems).toHaveLength(itemsWithTNode.length);
      expect($stepItems[0].querySelector(`.${stepItem}__title`).textContent).toBe('字符串标题');
      expect($stepItems[0].querySelector(`.${stepItem}__description`).textContent).toBe('字符串内容');
      expect($stepItems[1].querySelector(`.${stepItem}__title`).innerHTML).toContain('<span>React元素标题</span>');
      expect($stepItems[1].querySelector(`.${stepItem}__description`).innerHTML).toContain('<div>React元素内容</div>');
      expect($stepItems[2].querySelector(`.${stepItem}__title`).innerHTML).toContain('<strong>函数标题</strong>');
      expect($stepItems[2].querySelector(`.${stepItem}__description`).innerHTML).toContain('<em>函数内容</em>');
    });
    it(':icon', () => {
      const { container } = render(
        <Steps current={0} layout="vertical">
          {itemsWithTNode.map((item, index) => (
            <StepItem key={index} title={item.title} content={item.content} icon={<Icon name="cart" size="20px" />} />
          ))}
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      $stepItems.forEach((item) => {
        expect(item.querySelector(`.${stepItem}__icon`)).toBeTruthy();
        expect(item.querySelector(`.${prefix}-icon-cart`)).toBeTruthy();
      });
    });
    it(':extra', () => {
      const { container } = render(
        <Steps defaultCurrent={0}>
          {itemsWithTNode.map((item, index) => (
            <StepItem
              key={index}
              title={item.title}
              content={item.content}
              extra={
                index === 1 && (
                  <Image src="https://tdesign.gtimg.com/mobile/demos/steps1.png" alt="图标" style={{ width: '100%' }} />
                )
              }
            />
          ))}
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      const $extra = $stepItems[1].querySelector(`.${stepItem}__extra`);
      expect($extra).toBeTruthy();
      expect($extra.querySelector('img')).toBeTruthy();
    });
    it(':status', () => {
      const current = 1;
      const { container } = render(
        <Steps current={current}>
          {itemsWithTNode.map((item, index) => (
            <StepItem key={index} title={item.title} content={item.content} status={item.status as StepStatus} />
          ))}
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      $stepItems.forEach((item, index) => {
        expect(item.classList.contains(`${stepItem}--${itemsWithTNode[index].status}`));
      });
    });
    it(':titleRight', () => {
      const { container } = render(
        <Steps defaultCurrent={0} layout="vertical">
          {itemsWithTNode.map((item, index) => (
            <StepItem
              key={index}
              title={item.title}
              content={item.content}
              titleRight={<Icon name="chevron-right" size="22px" color="rgba(0, 0, 0, .4)" />}
            />
          ))}
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      $stepItems.forEach((item) => {
        expect(item.querySelector(`.${prefix}-icon.${prefix}-icon-chevron-right`)).toBeTruthy();
      });
      const { container: container2 } = render(
        <Steps defaultCurrent={0}>
          {itemsWithTNode.map((item, index) => (
            <StepItem
              key={index}
              title={item.title}
              content={item.content}
              titleRight={<Icon name="chevron-right" size="22px" color="rgba(0, 0, 0, .4)" />}
            />
          ))}
        </Steps>,
      );
      const $stepItems2 = container2.querySelectorAll(`.${stepItem}`);
      $stepItems2.forEach((item) => {
        expect(item.querySelector(`.${prefix}-icon`)).toBeNull();
      });
    });
  });
  describe('slot', () => {
    it('should render children as content', () => {
      const { container } = render(
        <Steps current={0}>
          <StepItem title="步骤1">
            <div className="custom-content">React for Mobile</div>
          </StepItem>
        </Steps>,
      );
      const $description = container.querySelector(`.${stepItem}__description`);
      expect($description.querySelector('.custom-content')).toBeTruthy();
      expect($description.textContent).toBe('React for Mobile');
      expect(container.firstChild).toMatchSnapshot();
    });
  });
  describe('edge cases', () => {
    it('should handle custom icon as false', () => {
      const { container } = render(
        <Steps current={0}>
          <StepItem title="步骤1" icon={false} />
        </Steps>,
      );
      const $stepItem = container.querySelector(`.${stepItem}`);
      expect($stepItem.querySelector(`.${stepItem}__icon`)).toBeFalsy();
      expect($stepItem.querySelector(`.${stepItem}__circle`)).toBeTruthy();
    });
    it('should handle custom status priority', () => {
      const { container } = render(
        <Steps current={0}>
          <StepItem title="步骤1" status="error" />
          <StepItem title="步骤2" status="finish" />
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      expect($stepItems[0].classList.contains(`${stepItem}--error`)).toBeTruthy();
      expect($stepItems[1].classList.contains(`${stepItem}--finish`)).toBeTruthy();
    });
    it('should render correct icons for different statuses', () => {
      const { container } = render(
        <Steps current={1}>
          <StepItem title="完成步骤" />
          <StepItem title="错误步骤" status="error" />
          <StepItem title="处理中步骤" />
        </Steps>,
      );
      const $stepItems = container.querySelectorAll(`.${stepItem}`);
      const finishIcon = $stepItems[0].querySelector(`.${stepItem}__circle`);
      expect(finishIcon).toBeTruthy();
      expect(finishIcon.textContent).toContain('');
      const errorIcon = $stepItems[1].querySelector(`.${stepItem}__circle`);
      expect(errorIcon).toBeTruthy();
      expect(errorIcon.textContent).toContain('');
      const processIcon = $stepItems[2].querySelector(`.${stepItem}__circle`);
      expect(processIcon).toBeTruthy();
      expect(processIcon.textContent).toContain('3');
    });
  });
});
