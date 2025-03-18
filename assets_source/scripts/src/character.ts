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
    label: CSS2DObject;
    hpbar: CSS2DObject;

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
        const charBar = new CSS2DObject(charHpBarBack);
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

    updateHp(hp: number): void {
        this.hp = hp;
        const percentageHp = (this.hp / this.totalhp) * 100;
        (this.hpbar.element.getElementsByClassName("hpfront")[0] as HTMLElement).style.width = `${percentageHp}%`;
    }

    updateLabel(distance: number): void {
        if (distance > 70) {
            if (this.hpbar.element.classList.contains("hpback")) {
                this.hpbar.element.classList.remove("hpback");
                this.hpbar.element.classList.add("nodisp");
            }
            if (this.label.element.classList.contains("label")) {
                this.label.element.classList.remove("label");
                this.label.element.classList.add("nodisp");
            }
        } else {
            const scaleFactor = 1 / (1 + 0.07 * distance);
            this.label.element.style.fontSize = `${scaleFactor * 30}px`;
            this.hpbar.element.style.width = `${200 * scaleFactor}px`;
            this.hpbar.element.style.height = `${20 * scaleFactor}px`;
            this.label.center.set(0.5, 4.5 - distance * 0.04);
            this.hpbar.center.set(0.5, 6.5 - distance * 0.05);
            if (this.hpbar.element.classList.contains("nodisp")) {
                this.hpbar.element.classList.remove("nodisp");
                this.hpbar.element.classList.add("hpback");
            }
            if (this.label.element.classList.contains("nodisp")) {
                this.label.element.classList.remove("nodisp");
                this.label.element.classList.add("label");
            }
        }
    }

    
    cleanup(): void {
        if (this.label && this.label.element && this.label.element.parentNode) {
            this.label.element.parentNode.removeChild(this.label.element);
        }
        if (this.hpbar && this.hpbar.element && this.hpbar.element.parentNode) {
            this.hpbar.element.parentNode.removeChild(this.hpbar.element);
        }
        this.cube.remove(this.label);
        this.cube.remove(this.hpbar);
    }
}
