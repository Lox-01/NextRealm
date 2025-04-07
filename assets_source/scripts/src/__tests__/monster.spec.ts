import * as THREE from 'three';
import { MonsterCube } from '../monster';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

describe('MonsterCube', () => {
  const mockId = 'monster1';
  const mockName = 'TestMonster';
  const mockHp = 50;
  const mockTotalHp = 100;
  const mockAttack = 10;
  const mockArange = 5;
  const mockCooldown = 2;
  const mockOrigin = { x: 0, y: 0, z: 0 };
  const mockRotation = { xr: 0, yr: 0, zr: 0 };
  const mockAggroRange = 20;
  const mockFollowRange = 50;
  const mockSpeed = 5;
  const mockModel = "/static/models/wolf.glb";

  let monster: MonsterCube;

  beforeEach(() => {
    monster = new MonsterCube(
      mockId,
      mockName,
      mockHp,
      mockTotalHp,
      mockAttack,
      mockArange,
      mockCooldown,
      mockOrigin,
      mockRotation,
      mockAggroRange,
      mockFollowRange,
      mockSpeed,
      mockModel
    );
  });

  it('should initialize with the correct properties', () => {
    expect(monster.id).toBe(mockId);
    expect(monster.name).toBe(mockName);
    expect(monster.hp).toBe(mockHp);
    expect(monster.totalhp).toBe(mockTotalHp);
    expect(monster.attack).toBe(mockAttack);
    expect(monster.arange).toBe(mockArange);
    expect(monster.cooldown).toBe(mockCooldown);
    expect(monster.origin).toEqual(mockOrigin);
    expect(monster.aggrorange).toBe(mockAggroRange);
    expect(monster.followrange).toBe(mockFollowRange);
    expect(monster.speed).toBe(mockSpeed);
    expect(monster.modelpath).toBe(mockModel);
  });

  it('should create a label', () => {
    expect(monster.label).toBeDefined();
    if (monster.label) {
      expect(monster.label).toBeInstanceOf(CSS2DObject);
      expect(monster.label.element.textContent).toBe(mockName);
    }
  });

  it('should create a health bar', () => {
    expect(monster.hpbar).toBeDefined();
    if (monster.hpbar) {
      expect(monster.hpbar).toBeInstanceOf(CSS2DObject);
    }
  });

  it('should update position', () => {
    expect(monster.cube).toBeDefined();
    const newPosition = { x: 1, y: 2, z: 3 };
    monster.updatePosition(newPosition);
    if (monster.cube) {
      expect(monster.cube.position.x).toBe(newPosition.x);
      expect(monster.cube.position.y).toBe(newPosition.y);
      expect(monster.cube.position.z).toBe(newPosition.z);
    }
  });

  it('should update rotation', () => {
    expect(monster.cube).toBeDefined();
    const newRotation = { xr: Math.PI, yr: Math.PI / 2, zr: 0 };
    monster.updateRotation(newRotation);
    if (monster.cube) {
      expect(monster.cube.rotation.x).toBe(newRotation.xr);
      expect(monster.cube.rotation.y).toBe(newRotation.yr);
      expect(monster.cube.rotation.z).toBe(newRotation.zr);
    }
  });

  it('should update HP and reflect it on the health bar', () => {
    expect(monster.hpbar).toBeDefined();
    if (monster.hpbar) {
      monster.updateHp(25);
      expect(monster.hp).toBe(25);
      const hpFront = monster.hpbar.element.getElementsByClassName('hpfront')[0] as HTMLElement;
      expect(hpFront.style.width).toBe('25%');
    }
  });
});
