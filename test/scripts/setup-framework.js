// setup file
import 'babel-polyfill';
import '@testing-library/jest-dom/extend-expect';
import ResizeObserver from 'resize-observer-polyfill';
import 'jest-canvas-mock'

global.ResizeObserver = ResizeObserver;

jest.useFakeTimers();
