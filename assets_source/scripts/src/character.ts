import * as THREE from 'three';
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

export interface Position {
    x: number;
    y: number;
    z: number;
}

export interface Rotation {
    xr: number;
    yr: number;
    zr: number;
}

export abstract class CharacterCube {
    type: string;
    id: string;
    username: string;
    hp: number;
    totalhp: number;

    constructor(
        type: string,
        id: string,
        username: string,
        hp: number,
        totalhp: number
    ) {
        this.type = type;
        this.id = id;
        this.username = username;
        this.hp = hp;
        this.totalhp = totalhp;
    }
}