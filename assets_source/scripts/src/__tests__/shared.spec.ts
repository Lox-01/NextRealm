import { tri, gri, rtd, dtr, dir, deffunc } from '../shared';

describe('tri', () => {
  it('calculates the distance between two points in 3D space', () => {
    const a = { x: 0, y: 0, z: 0 };
    const b = { x: 3, y: 4, z: 0 };
    expect(tri(a, b)).toBe(5); // Pythagorean theorem: √(3² + 4²) = 5
  });

  it('returns 0 when both points are the same', () => {
    const a = { x: 1, y: 1, z: 1 };
    const b = { x: 1, y: 1, z: 1 };
    expect(tri(a, b)).toBe(0);
  });
});

describe('gri', () => {
  it('generates a random integer within the specified range', () => {
    const min = 1;
    const max = 10;
    const result = gri(min, max);
    expect(result).toBeGreaterThanOrEqual(Math.ceil(min));
    expect(result).toBeLessThan(Math.floor(max));
  });
});

describe('rtd', () => {
  it('converts radians to degrees', () => {
    expect(rtd(Math.PI)).toBeCloseTo(180);
    expect(rtd(0)).toBe(0);
  });
});

describe('dtr', () => {
  it('converts degrees to radians', () => {
    expect(dtr(180)).toBeCloseTo(Math.PI);
    expect(dtr(0)).toBe(0);
  });
});

describe('dir', () => {
  it('logs property and method names of an object', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const testObj = {
      prop1: 'value1',
      method1: () => 'method1',
    };
    Object.setPrototypeOf(testObj, { method2: () => 'method2' });

    dir(testObj);

    expect(consoleSpy).toHaveBeenCalledWith('Property - prop1');
    expect(consoleSpy).toHaveBeenCalledWith('Property - method1');
    expect(consoleSpy).toHaveBeenCalledWith('Method - method2');

    consoleSpy.mockRestore();
  });

  it('logs an error if the input is not an object', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    dir(42);
    expect(consoleSpy).toHaveBeenCalledWith('Input is not a valid object.');
    consoleSpy.mockRestore();
  });
});

describe('deffunc', () => {
  it('logs the definition of a function', () => {
    const testFunc = () => 'test';
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    deffunc(testFunc);
    expect(consoleSpy).toHaveBeenCalledWith('Function Definition:');
    expect(consoleSpy).toHaveBeenCalledWith(testFunc.toString());
    consoleSpy.mockRestore();
  });

  it('logs an error if the input is not a function', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    deffunc(42 as unknown as Function);
    expect(consoleSpy).toHaveBeenCalledWith('Input is not a valid function.');
    consoleSpy.mockRestore();
  });
});
