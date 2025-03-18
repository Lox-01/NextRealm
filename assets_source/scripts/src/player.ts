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
}
