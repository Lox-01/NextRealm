import * as THREE from 'three';
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";

export interface SockerPlayer {
    id: string;
    username: string;
    hp: number;
    totalhp: number;
    pos: {x: number, y: number, z: number};
    rot: {xr: number, yr: number, zr: number};
} 

export class PlayerCube {
    type: string;
    id: any;
    totalhp: any;
    hp: any;
    username: any;
    cube: any;
    label: any;
    hpbar: any;
    constructor(id, position, rotation, hp, username, totalhp) {
        this.type = "player";
        this.id = id;
        this.totalhp = totalhp;
        this.hp = hp;
        this.username = username;
        this.cube = this.createCube();
        this.label = this.createLabel();
        this.hpbar = this.createHpBar();
        this.updatePosition(position);
        this.updateRotation(rotation);
    }
    createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = [
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        ];
        const cubeMesh = new THREE.Mesh(geometry, material);
        cubeMesh.name = this.id;
        return cubeMesh;
    }

    createLabel() {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'label';
        playerDiv.textContent = `${this.username}`;
        playerDiv.style.backgroundColor = 'transparent';
        const playerLabel = new CSS2DObject( playerDiv );
        playerLabel.position.set( 0, 0, 0 );
        playerLabel.center.set( 0.5, 4.5 );
        this.cube.add( playerLabel );
        playerLabel.layers.set( 0 );
        playerLabel.element.style.fontSize="30px";
        return playerLabel;
    }

    createHpBar() {
        const playerHpBarBack = document.createElement('div');
        const playerHpBarFront = document.createElement('div');
        playerHpBarBack.className = 'hpback';
        playerHpBarFront.className = 'hpfront';
        playerHpBarBack.appendChild(playerHpBarFront);
        const playerBar = new CSS2DObject( playerHpBarBack );
        playerHpBarBack.style.width = '200px';
        playerHpBarBack.style.height = '20px';
        playerBar.position.set( 0, 0, 0 );
        playerBar.center.set( 0.5, 6.5 );
        this.cube.add( playerBar );
        playerBar.layers.set( 0 );
        return playerBar;
    }

    cleanup() {
        if (this.label && this.label.element && this.label.element.parentNode) {
            this.label.element.parentNode.removeChild(this.label.element);
        }
        if (this.hpbar && this.hpbar.element && this.hpbar.element.parentNode) {
            this.hpbar.element.parentNode.removeChild(this.hpbar.element);
        }
        this.cube.remove(this.label);
        this.cube.remove(this.hpbar);
    }

    updatePosition(position) {
        this.cube.position.set(position.x, position.y, position.z);
    }
    updateRotation(rotation) {
        this.cube.rotation.set(rotation.xr, rotation.yr, rotation.zr);
    }

    updateHp(hp) {
        this.hp = hp;
        let percentageHp = this.hp/this.totalhp*100;
        this.hpbar.element.getElementsByClassName("hpfront")[0].style.width = `${percentageHp}%`;
    }

    updateLabel(distance) {
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
            const scaleFactor = 1/(1+0.07*distance);
            this.label.element.style.fontSize = `${scaleFactor*30}px`;
            this.hpbar.element.style.width = `${200 * scaleFactor}px`;
            this.hpbar.element.style.height = `${20 * scaleFactor}px`;
            this.label.center.set(0.5,4.5-distance*0.04);
            this.hpbar.center.set(0.5,6.5-distance*0.05);
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
}