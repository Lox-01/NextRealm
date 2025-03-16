import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Position, Rotation, CharacterCube } from "./character";

export interface SockerPlayer {
    id: string;
    username: string;
    hp: number;
    totalhp: number;
    pos: Position;
    rot: Rotation;
}

export class PlayerCube extends CharacterCube {
    label: CSS2DObject;
    hpbar: CSS2DObject;

    constructor(
        id: string,
        position: Position,
        rotation: Rotation,
        hp: number,
        username: string,
        totalhp: number
    ) {
        super("player", id, username, hp, totalhp);
        this.updatePosition(position);
        this.updateRotation(rotation);
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

    updateHp(hp: number): void {
        this.hp = hp;
        const percentageHp = (this.hp / this.totalhp) * 100;
        const hpFrontElement = this.hpbar.element.getElementsByClassName(
            "hpfront"
        )[0] as HTMLElement;
        hpFrontElement.style.width = `${percentageHp}%`;
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
}
