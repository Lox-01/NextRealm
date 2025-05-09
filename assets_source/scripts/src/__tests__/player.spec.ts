import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { PlayerCube } from '../player';

describe('PlayerCube', () => {
  const mockId = 'player1';
  const mockPosition = { x: 0, y: 0, z: 0 };
  const mockRotation = { xr: 0, yr: 0, zr: 0 };
  const mockHp = 100;
  const mockTotalHp = 150;
  const mockName = 'TestPlayer';
  const mockModel = '/static/models/player.glb';

  let player: PlayerCube;

  beforeEach(() => {
    player = new PlayerCube(
      mockId,
      mockPosition,
      mockRotation,
      mockHp,
      mockName,
      mockTotalHp,
      mockModel
    );
  });

  it('should initialize with the correct properties', () => {
    expect(player.id).toBe(mockId);
    expect(player.type).toBe('player');
    expect(player.hp).toBe(mockHp);
    expect(player.totalhp).toBe(mockTotalHp);
    expect(player.name).toBe(mockName);
    expect(player.modelpath).toBe(mockModel);
  });

  it('should create a label', () => {
    expect(player.label).toBeDefined();
    if (player.label) {
      expect(player.label).toBeInstanceOf(CSS2DObject);
      expect(player.label.element.textContent).toBe(mockName);
    }
  });

  it('should create a health bar', () => {
    expect(player.hpbar).toBeDefined();
    if (player.hpbar) {
      expect(player.hpbar).toBeInstanceOf(CSS2DObject);
    }
  });

  it('should update position', () => {
    expect(player.cube).toBeDefined();
    if (player.cube) {
      const newPosition = { x: 1, y: 2, z: 3 };
      player.updatePosition(newPosition);
      expect(player.cube.position.x).toBe(newPosition.x);
      expect(player.cube.position.y).toBe(newPosition.y);
      expect(player.cube.position.z).toBe(newPosition.z);
    }
  });

  it('should update rotation', () => {
    expect(player.cube).toBeDefined();
    if (player.cube) {
      const newRotation = { xr: Math.PI, yr: Math.PI / 2, zr: 0 };
      player.updateRotation(newRotation);
      expect(player.cube.rotation.x).toBe(newRotation.xr);
      expect(player.cube.rotation.y).toBe(newRotation.yr);
      expect(player.cube.rotation.z).toBe(newRotation.zr);
    }
  });

  it('should update HP and reflect it on the health bar', () => {
    expect(player.hpbar).toBeDefined();
    if (player.hpbar) {
      const newHp = 75;
      player.updateHp(newHp);
      expect(player.hp).toBe(newHp);
      const hpFrontElement = player.hpbar.element.getElementsByClassName('hpfront')[0] as HTMLElement;
      expect(hpFrontElement.style.width).toBe('50%'); // 75 out of 150 is 50%
    }
  });

  it('should handle cleanup correctly', () => {
    expect(player.cube).toBeDefined();
    expect(player.label).toBeDefined();
    expect(player.hpbar).toBeDefined();
    if (player.cube && player.label && player.hpbar) {
      const parentNodeMock = document.createElement('div');
      parentNodeMock.appendChild(player.label.element);
      parentNodeMock.appendChild(player.hpbar.element);
      player.cleanup();
      expect(player.cube.children).not.toContain(player.label);
      expect(player.cube.children).not.toContain(player.hpbar);
      expect(parentNodeMock.contains(player.label.element)).toBe(false);
      expect(parentNodeMock.contains(player.hpbar.element)).toBe(false);
    }
  });
});
