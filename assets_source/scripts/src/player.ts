import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { Position, Rotation, CharacterCube } from "./character";

export interface SocketPlayer {
    id: string;
    name: string;
    hp: number;
    totalhp: number;
    pos: Position;
    rot: Rotation;
	modelpath: string;
}

export class PlayerCube extends CharacterCube {
    constructor(
        id: string,
        position: Position,
        rotation: Rotation,
        hp: number,
        name: string,
        totalhp: number,
		modelpath: string
    ) {
        super("player", id, name, hp, totalhp, modelpath);
        this.updatePosition(position);
        this.updateRotation(rotation);
    }

	showDeathMessage(socket): void {
		let existingDeathMessage = document.getElementById("death-message");
		if (existingDeathMessage) {
			existingDeathMessage.remove();
		}
		const deathMessage = document.createElement("div");
		deathMessage.id = "death-message";
		deathMessage.innerHTML = `<p>YOU DIED...</p><button id='respawn-btn'>Respawn</button>`;
		document.body.appendChild(deathMessage);
		setTimeout(() => {
			const respawnBtn = document.getElementById("respawn-btn");
			if (respawnBtn) {
				respawnBtn.addEventListener("click", () => {
					socket.emit("respawn", this.id);
					document.body.removeChild(deathMessage);
					this.respawn();
				});
			} else {
				console.error("Respawn button not found.");
			}
		}, 0);
	}

	respawn(): void {
		if (this.cube && this.hpbar && this.label) {
			this.isalive = true;
			if (!this.cube.parent) {
				scene?.add(this.cube);
			}
			if (!this.hpbar.parent) {
				this.cube.add(this.hpbar);
			}
			if (!this.label.parent) {
				this.cube.add(this.label);
			}
		}
	}
}
