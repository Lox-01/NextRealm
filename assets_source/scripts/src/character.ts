import * as THREE from 'three';
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

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
    name: string;
    hp: number;
    totalhp: number;
    cube: THREE.Mesh | null | any;
    label: CSS2DObject | null;
    hpbar: CSS2DObject | null;
    isalive: boolean;
    modelpath: string;

    constructor(
        type: string,
        id: string,
        name: string,
        hp: number,
        totalhp: number,
        modelpath: string
    ) {
        this.type = type;
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.totalhp = totalhp;
        this.cube = null;
        this.label = null;
        this.hpbar = null;
        this.modelpath = modelpath;
        this.loadModel(modelpath).then((model) => {
            this.cube = model;
            this.label = this.createLabel();
            this.hpbar = this.createHpBar();
            globalThis.scene.add(this.cube);
        });
        this.label = this.createLabel();
        this.hpbar = this.createHpBar();
        this.isalive = hp <= 0 ? false : true;
    }

    /*
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
    */

    async loadModel(modelPath: string): Promise<THREE.Group> {
        const loader = new GLTFLoader();
        const baseUrl = window.location.origin; // Base URL of the Flask app
        const fullPath = `${baseUrl}/${modelPath}`;
        return new Promise((resolve, reject) => {
            loader.load(
                fullPath,
                (gltf) => resolve(gltf.scene),
                undefined,
                (error) => reject(error)
            );
        });
    }

    createLabel(): CSS2DObject {
        const charDiv = document.createElement('div');
        charDiv.className = 'label';
        charDiv.textContent = `${this.name}`;
        charDiv.style.backgroundColor = 'transparent';
        const charLabel = new CSS2DObject(charDiv);
        charLabel.position.set(0, 0, 0);
        charLabel.center.set(0.5, 4.5);
        if (this.cube) {
            this.cube.add(charLabel);
        }
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
        if (this.cube) {
            this.cube.add(charBar);
        }
        charBar.layers.set(0);
        const percentageHp = (this.hp / this.totalhp) * 100;
        (charBar?.element.getElementsByClassName("hpfront")[0] as HTMLElement).style.width = `${percentageHp}%`;
        return charBar;
    }

    updatePosition(position: Position): void {
        if (this.cube) {
            this.cube.position.set(position.x, position.y, position.z);
        }
    }

    updateRotation(rotation: Rotation): void {
        if (this.cube) {
            this.cube.rotation.set(rotation.xr, rotation.yr, rotation.zr);
        }
    }

    updateHp(hp: number): void {
        this.hp = hp;
        const percentageHp = (this.hp / this.totalhp) * 100;
        (this.hpbar?.element.getElementsByClassName("hpfront")[0] as HTMLElement).style.width = `${percentageHp}%`;
    }

    updateLabel(distance: number): void {
        if (distance > 70) {
            if (this.hpbar?.element.classList.contains("hpback")) {
                this.hpbar?.element.classList.remove("hpback");
                this.hpbar?.element.classList.add("nodisp");
            }
            if (this.label?.element.classList.contains("label")) {
                this.label?.element.classList.remove("label");
                this.label?.element.classList.add("nodisp");
            }
        } else {
            const scaleFactor = 1 / (1 + 0.07 * distance);
            if (this.label && this.hpbar) {
                this.label.element.style.fontSize = `${scaleFactor * 30}px`;
                this.hpbar.element.style.width = `${200 * scaleFactor}px`;
                this.hpbar.element.style.height = `${20 * scaleFactor}px`;
                this.label.center.set(0.5, 4.5 - distance * 0.04);
                this.hpbar.center.set(0.5, 6.5 - distance * 0.05);
            }
            if (this.hpbar?.element.classList.contains("nodisp")) {
                this.hpbar?.element.classList.remove("nodisp");
                this.hpbar?.element.classList.add("hpback");
            }
            if (this.label?.element.classList.contains("nodisp")) {
                this.label?.element.classList.remove("nodisp");
                this.label?.element.classList.add("label");
            }
        }
    }

    handleDeath(): void {
        if (this.cube && this.label && this.hpbar) {
            if (this.cube.parent === null) return;
            if (this.cube.parent) {
                this.cube.parent.remove(this.cube);
            }
            if (this.label.parent) {
                this.label.parent.remove(this.label);
            }
            if (this.hpbar.parent) {
                this.hpbar.parent.remove(this.hpbar);
            }
            this.isalive = false;
        }
    }

    cleanup(): void {
        if (this.cube && this.label && this.hpbar) {
            if (this.label && this.label?.element && this.label?.element.parentNode) {
                this.label?.element.parentNode.removeChild(this.label?.element);
            }
            if (this.hpbar && this.hpbar?.element && this.hpbar?.element.parentNode) {
                this.hpbar?.element.parentNode.removeChild(this.hpbar?.element);
            }
            this.cube.remove(this.label);
            this.cube.remove(this.hpbar);
        }
    }
}
