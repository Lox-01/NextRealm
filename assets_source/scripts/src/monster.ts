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
    lerpTarget: any;
    lerpStartTime: number | undefined;
    lerpDuration: number | undefined;
    constructor(
        id: string,
        username: string,
        hp: number,
        totalhp: number,
        attack,
        arange,
        cooldown,
        origin,
        rotation,
        aggrorange,
        followrange,
        speed
    ) {
        super("monster", id, username, hp, totalhp);
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

    startLerpToPosition(targetPos) {
        this.lerpStart = this.cube.position.clone();
        this.lerpTarget = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);
        this.lerpStartTime = performance.now();
        this.lerpDuration = 100;
    }
}
