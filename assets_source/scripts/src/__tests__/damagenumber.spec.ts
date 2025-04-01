import { DamageNumber } from '../damagenumber';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import * as THREE from 'three';

// Mocking the shared `tri` function
/*
vi.mock('./shared', () => ({
  tri: vi.fn(() => 0.5), // Mock return value for testing purposes
}));
*/

describe('DamageNumber', () => {
  let mockScene: THREE.Scene;
  let mockPlayer: { cube: THREE.Mesh };
  let damage: number;

  beforeEach(() => {
    globalThis.playersCubes = {};
    globalThis.my_id = '1';
    mockScene = new THREE.Scene();
    mockPlayer = { cube: new THREE.Mesh() };
    mockPlayer.cube.position.set(1, 1, 1);
    playersCubes[my_id] = mockPlayer;
    damage = 100;
  });

  it('should initialize correctly', () => {
    const damageNumber = new DamageNumber(mockScene, mockPlayer, damage);

    // Check properties
    expect(damageNumber.scene).toBe(mockScene);
    expect(damageNumber.player).toBe(mockPlayer);
    expect(damageNumber.damage).toBe(damage);
    expect(damageNumber.element.textContent).toBe(damage.toString());
    expect(damageNumber.element.style.color).toBe('red');

    // Check CSS2DObject
    expect(damageNumber.css2dObject).toBeInstanceOf(CSS2DObject);
    expect(damageNumber.css2dObject.position.x).toBe(mockPlayer.cube.position.x);
    expect(damageNumber.css2dObject.position.y).toBe(mockPlayer.cube.position.y + 1);
    expect(damageNumber.css2dObject.position.z).toBe(mockPlayer.cube.position.z);

    // Check if CSS2DObject is added to the scene
    expect(mockScene.children).toContain(damageNumber.css2dObject);
  });

  it('should update correctly', () => {
    const damageNumber = new DamageNumber(mockScene, mockPlayer, damage);

    // Set an initial opacity
    damageNumber.element.style.opacity = '1';

    // Call update()
    damageNumber.update();

    // Check opacity decrease
    expect(damageNumber.element.style.opacity).toBe('0.95');

    // Check position update
    expect(damageNumber.css2dObject.position.y).toBeCloseTo(mockPlayer.cube.position.y + 2 - 0.95);

    // Simulate further updates until opacity < 0.5
    damageNumber.element.style.opacity = '0.5';
    damageNumber.update();

    // Check if the CSS2DObject is removed from the scene
    expect(mockScene.children).not.toContain(damageNumber.css2dObject);
  });
});