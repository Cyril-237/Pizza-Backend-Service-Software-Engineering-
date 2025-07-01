import '@testing-library/jest-dom';
import { expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

// Add custom matchers type to global expect
declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T> {}
}
