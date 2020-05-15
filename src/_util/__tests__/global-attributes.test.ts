import {
    getDataSet,
    getGlobalAttributes,
} from '../global-attributes';

test('getDataSet', () => {
    expect(getDataSet()).toEqual({});

    expect(getDataSet({
        'data-name': 1,
        b: 2,
    })).toEqual({
        'data-name': 1,
    });
});

test('getGlobalAttributes', () => {
    expect(getGlobalAttributes()).toEqual({});

    expect(getGlobalAttributes({
        'data-name': 1,
        b: 2,
    })).toEqual({
        'data-name': 1,
    });
});
