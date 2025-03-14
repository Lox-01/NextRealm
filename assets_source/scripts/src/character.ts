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
    cube: THREE.Mesh;

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
        this.cube = this.createCube();
    }

    createCube(): THREE.Mesh {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = [
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff }),
        ];
        const cubeMesh = new THREE.Mesh(geometry, material);
        cubeMesh.name = this.id;
        return cubeMesh;
    }
}
