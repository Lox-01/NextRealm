import { tri, gri, rtd, dtr } from '../shared';

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
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(gri(1, 10)).toBe(1);
    vi.restoreAllMocks();
  });

  it('supports a mocked upper endpoint', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(gri(1, 10)).toBeLessThan(10);
    vi.restoreAllMocks();
  });

  it('rejects invalid ranges', () => {
    expect(() => gri(10, 10)).toThrow(RangeError);
    expect(() => gri(10, 1)).toThrow(RangeError);
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