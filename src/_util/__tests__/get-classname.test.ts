import getClassName from '../get-classname';

test('getClassName', () => {
    expect(getClassName()).toBe('');
    expect(getClassName({
        prefixCls: '',
        className: 'hello',
        size: 'large',
        disabled: true,
        classNames: prefixCls => `${prefixCls}-abc`,
    })).toBe('hello');
    expect(getClassName({
        prefixCls: 'tDesign-input',
        className: 'hello',
        size: 'large',
        disabled: true,
        classNames: prefixCls => `${prefixCls}-abc`,
    })).toBe('hello tDesign-input tDesign-input-large tDesign-input-disabled tDesign-input-abc');
});
