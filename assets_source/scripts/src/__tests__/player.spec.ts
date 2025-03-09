import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { PlayerCube } from '../player';

describe('PlayerCube', () => {
  const mockId = 'player1';
  const mockPosition = { x: 0, y: 0, z: 0 };
  const mockRotation = { xr: 0, yr: 0, zr: 0 };
  const mockHp = 100;
  const mockTotalHp = 150;
  const mockUsername = 'TestPlayer';

  let player: PlayerCube;

  beforeEach(() => {
    player = new PlayerCube(
      mockId,
      mockPosition,
      mockRotation,
      mockHp,
      mockUsername,
      mockTotalHp
    );
  });

  it('should initialize with the correct properties', () => {
    expect(player.id).toBe(mockId);
    expect(player.type).toBe('player');
    expect(player.hp).toBe(mockHp);
    expect(player.totalhp).toBe(mockTotalHp);
    expect(player.username).toBe(mockUsername);
  });

  it('should create a cube', () => {
    expect(player.cube).toBeInstanceOf(THREE.Mesh);
    expect(player.cube.name).toBe(mockId);
  });

  it('should create a label', () => {
    expect(player.label).toBeInstanceOf(CSS2DObject);
    expect(player.label.element.textContent).toBe(mockUsername);
  });

  it('should create a health bar', () => {
    expect(player.hpbar).toBeInstanceOf(CSS2DObject);
  });

  it('should update position', () => {
    const newPosition = { x: 1, y: 2, z: 3 };
    player.updatePosition(newPosition);
    expect(player.cube.position.x).toBe(newPosition.x);
    expect(player.cube.position.y).toBe(newPosition.y);
    expect(player.cube.position.z).toBe(newPosition.z);
  });

  it('should update rotation', () => {
    const newRotation = { xr: Math.PI, yr: Math.PI / 2, zr: 0 };
    player.updateRotation(newRotation);
    expect(player.cube.rotation.x).toBe(newRotation.xr);
    expect(player.cube.rotation.y).toBe(newRotation.yr);
    expect(player.cube.rotation.z).toBe(newRotation.zr);
  });

  it('should update HP and reflect it on the health bar', () => {
    const newHp = 75;
    player.updateHp(newHp);
    expect(player.hp).toBe(newHp);
    const hpFrontElement = player.hpbar.element.getElementsByClassName('hpfront')[0] as HTMLElement;
    expect(hpFrontElement.style.width).toBe('50%'); // 75 out of 150 is 50%
  });

  it('should handle cleanup correctly', () => {
    const parentNodeMock = document.createElement('div');
    parentNodeMock.appendChild(player.label.element);
    parentNodeMock.appendChild(player.hpbar.element);

    player.cleanup();

    expect(player.cube.children).not.toContain(player.label);
    expect(player.cube.children).not.toContain(player.hpbar);
    expect(parentNodeMock.contains(player.label.element)).toBe(false);
    expect(parentNodeMock.contains(player.hpbar.element)).toBe(false);
  });
});
