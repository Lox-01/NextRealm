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
        this.label = this.createLabel();
        this.hpbar = this.createHpBar();
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

    createLabel(): CSS2DObject {
        const charDiv = document.createElement('div');
        charDiv.className = 'label';
        charDiv.textContent = `${this.username}`;
        charDiv.style.backgroundColor = 'transparent';
        const charLabel = new CSS2DObject(charDiv);
        charLabel.position.set(0, 0, 0);
        charLabel.center.set(0.5, 4.5);
        this.cube.add(charLabel);
        charLabel.layers.set(0);
        charLabel.element.style.fontSize = "30px";
        return charLabel;
    }

    createHpBar() {
        const charHpBarBack = document.createElement('div');
        const charHpBarFront = document.createElement('div');
        charHpBarBack.className = 'hpback';
        charHpBarFront.className = 'hpfront';
        charHpBarBack.appendChild(charHpBarFront);
        const monsterBar = new CSS2DObject(charHpBarBack);
        charHpBarBack.style.width = '200px';
        charHpBarBack.style.height = '20px';
        charBar.position.set(0, 0, 0);
        charBar.center.set(0.5, 6.5);
        this.cube.add(charBar);
        charBar.layers.set(0);
        return charBar;
    }
    
    updatePosition(position: Position): void {
        this.cube.position.set(position.x, position.y, position.z);
    }

    updateRotation(rotation: Rotation): void {
        this.cube.rotation.set(rotation.xr, rotation.yr, rotation.zr);
    }
}
