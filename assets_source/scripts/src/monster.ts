import * as THREE from 'three';
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export interface SocketMonster {
    name : string;
    hp : number;
    totalhp : number;
    attack : number;
    arange : number;
    cooldown : number;
    origin : {x: number, y: number, z: number};
    pos : {x: number, y: number, z: number};
    rot : {xr: number, yr: number, zr: number};
    aggrorange : number;
    followrange : number;
    speed : number;
    id : string;
}

export class MonsterCube {
    type: string;
    id: any;
    name: any;
    hp: any;
    totalhp: any;
    attack: any;
    arange: any;
    cooldown: any;
    origin: any;
    aggrorange: any;
    followrange: any;
    speed: any;
    cube: any;
    label: CSS2DObject | null;
    hpbar: CSS2DObject | null;
    threats: {};
    lerpStart: any;
    lerpTarget: any;
    lerpStartTime: number | undefined;
    lerpDuration: number | undefined;
    constructor(id, name, hp, totalhp, attack, arange, cooldown, origin, rotation, aggrorange, followrange, speed) {
        this.type = "monster";
        this.id = id;
        this.name = name;
        this.hp = hp;
        this.totalhp = totalhp;
        this.attack = attack;
        this.arange = arange;
        this.cooldown = cooldown;
        this.origin = origin;
        this.aggrorange = aggrorange;
        this.followrange = followrange;
        this.speed = speed;
        this.cube = null; // Placeholder for the sprite
        this.threats = {};
        this.label = null;
        this.hpbar = null;
        
        // Start loading the sprite asynchronously
        this.loadSprite("/sprites/enimy.glb").then((sprite) => {
            this.cube = sprite;
            this.label = this.createLabel();
            this.hpbar = this.createHpBar();
            this.updatePosition(origin);
            this.updateRotation(rotation);
            globalThis.scene.Add(this.cube);
        });
    }

         // Asynchronous method to load the GLTF model
    async loadSprite(modelPath: string): Promise<THREE.Group> {
        const loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
            loader.load(
                modelPath,
                (gltf) => resolve(gltf.scene),
                undefined,
                (error) => reject(error)
            );
        });
    }

    createLabel() {
        const monsterDiv = document.createElement('div');
        monsterDiv.className = 'label';
        monsterDiv.textContent = `${this.name}`;
        monsterDiv.style.backgroundColor = 'transparent';
        const monsterLabel = new CSS2DObject( monsterDiv );
        monsterLabel.position.set( 0, 0, 0 );
        monsterLabel.center.set( 0.5, 4.5 );
        this.cube.add( monsterLabel );
        monsterLabel.layers.set( 0 );
        monsterLabel.element.style.fontSize="30px";
        return monsterLabel;
    }

    createHpBar() {
        const monsterHpBarBack = document.createElement('div');
        const monsterHpBarFront = document.createElement('div');
        monsterHpBarBack.className = 'hpback';
        monsterHpBarFront.className = 'hpfront';
        monsterHpBarBack.appendChild(monsterHpBarFront);
        const monsterBar = new CSS2DObject( monsterHpBarBack );
        monsterHpBarBack.style.width = '200px';
        monsterHpBarBack.style.height = '20px';
        monsterBar.position.set( 0, 0, 0 );
        monsterBar.center.set( 0.5, 6.5 );
        this.cube.add( monsterBar );
        monsterBar.layers.set( 0 );
        return monsterBar;
    }

    updatePosition(position) {
        this.cube.position.set(position.x, position.y, position.z);
    }
    updateRotation(rotation) {
        this.cube.rotation.set(rotation.xr, rotation.yr, rotation.zr);
    }
    startLerpToPosition(targetPos) {
        this.lerpStart = this.cube.position.clone();
        this.lerpTarget = new THREE.Vector3(targetPos.x, targetPos.y, targetPos.z);
        this.lerpStartTime = performance.now();
        this.lerpDuration = 100;
    }

    updateHp(hp) {
        this.hp = hp;
        let percentageHp = this.hp/this.totalhp*100;
        (this.hpbar?.element.getElementsByClassName("hpfront")[0] as HTMLElement).style.width = `${percentageHp}%`;
    }

    updateLabel(distance) {
        if (distance > 70) {
            if (this.hpbar?.element.classList.contains("hpback")) {
                this.hpbar.element.classList.remove("hpback");
                this.hpbar.element.classList.add("nodisp");
            }
            if (this.label?.element.classList.contains("label")) {
                this.label.element.classList.remove("label");
                this.label.element.classList.add("nodisp");
            }
        } else {
            const scaleFactor = 1/(1+0.07*distance);
            if(this.label && this.hpbar)    {
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
}