import * as THREE from 'three';
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Position, Rotation, CharacterCube } from "./character";

export interface SocketMonster {
    name: string;
    hp: number;
    totalhp: number;
    attack: number;
    arange: number;
    cooldown: number;
    origin: Position;
    pos: Position;
    rot: Rotation;
    aggrorange: number;
    followrange: number;
    speed: number;
    id: string;
    modelpath: string;
}

export class MonsterCube extends CharacterCube {
    attack: any;
    arange: any;
    cooldown: any;
    origin: any;
    aggrorange: any;
    followrange: any;
    speed: any;
    threats: {};
    lerpStart: any;
    lerpStartR: any;
    lerpTarget: any;
    lerpTargetR: any;
    lerpStartTime: number | undefined;
    lerpDuration: number | undefined;
    constructor(
        id: string,
        name: string,
        hp: number,
        totalhp: number,
        attack: number,
        arange: number,
        cooldown: number,
        origin,
        rotation,
        aggrorange: number,
        followrange: number,
        speed: number,
        modelpath: string
    ) {
        super("monster", id, name, hp, totalhp, modelpath);
        this.attack = attack;
        this.arange = arange;
        this.cooldown = cooldown;
        this.origin = origin;
        this.aggrorange = aggrorange;
        this.followrange = followrange;
        this.speed = speed;
        this.updatePosition(origin);
        this.updateRotation(rotation);
        this.threats = {};
    }

    startLerp(targetPos, targetRot) {
        if (this.cube) {
            this.lerpStart = this.cube.position.clone();
            this.lerpTarget = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);
            this.lerpStartR = this.cube.quaternion.clone();
            this.lerpTargetR = new THREE.Quaternion().setFromEuler(new THREE.Euler(targetRot.xr, targetRot.yr, targetRot.zr));
            this.lerpStartTime = performance.now();
            this.lerpDuration = 100;
        }
    }

    handleDeath(): void {
        super.handleDeath();
        this.lerpStart = null;
        this.lerpTarget = null;
        this.lerpStartTime = undefined;
        this.lerpDuration = undefined;
    }

    respawn(mon: Record<string, any>): void {
        if (this.cube && this.hpbar && this.label) {
            this.updatePosition(mon.pos);
            this.updateRotation(mon.rot);
            this.updateHp(mon.hp);
            this.isalive = true;
            if (!this.cube.parent) {
                scene?.add(this.cube);
            }
            if (!this.hpbar.parent) {
                this.cube.add(this.hpbar);
            }
            if (!this.label.parent) {
                this.cube.add(this.label);
            }
        }
	}
}
