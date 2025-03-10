import * as THREE from "three";
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

export interface SockerPlayer {
	id: string;
	username: string;
	hp: number;
	totalhp: number;
	pos: Position;
	rot: Rotation;
}

export class PlayerCube {
	type: string;
	id: string;
	totalhp: number;
	hp: number;
	username: string;
	cube: THREE.Mesh;
	label: CSS2DObject;
	hpbar: CSS2DObject;
	isalive: boolean;

	constructor(
		id: string,
		position: Position,
		rotation: Rotation,
		hp: number,
		username: string,
		totalhp: number
	) {
		this.type = "player";
		this.id = id;
		this.totalhp = totalhp;
		this.hp = hp;
		this.username = username;
		this.cube = this.createCube();
		this.label = this.createLabel();
		this.hpbar = this.createHpBar();
		this.isalive = hp <= 0 ? false : true;
		this.updatePosition(position);
		this.updateRotation(rotation);
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
		const playerDiv = document.createElement("div");
		playerDiv.className = "label";
		playerDiv.textContent = `${this.username}`;
		playerDiv.style.backgroundColor = "transparent";
		const playerLabel = new CSS2DObject(playerDiv);
		playerLabel.position.set(0, 0, 0);
		playerLabel.center.set(0.5, 4.5);
		this.cube.add(playerLabel);
		playerLabel.layers.set(0);
		playerLabel.element.style.fontSize = "30px";
		return playerLabel;
	}

	createHpBar(): CSS2DObject {
		const playerHpBarBack = document.createElement("div");
		const playerHpBarFront = document.createElement("div");
		playerHpBarBack.className = "hpback";
		playerHpBarFront.className = "hpfront";
		playerHpBarBack.appendChild(playerHpBarFront);
		const playerBar = new CSS2DObject(playerHpBarBack);
		playerHpBarBack.style.width = "200px";
		playerHpBarBack.style.height = "20px";
		playerBar.position.set(0, 0, 0);
		playerBar.center.set(0.5, 6.5);
		this.cube.add(playerBar);
		playerBar.layers.set(0);
		const percentageHp = (this.hp / this.totalhp) * 100;
		const hpFrontElement = playerBar.element.getElementsByClassName(
			"hpfront"
		)[0] as HTMLElement;
		hpFrontElement.style.width = `${percentageHp}%`;
		return playerBar;
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

	updatePosition(position: Position): void {
		this.cube.position.set(position.x, position.y, position.z);
	}

	updateRotation(rotation: Rotation): void {
		this.cube.rotation.set(rotation.xr, rotation.yr, rotation.zr);
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

	handleDeath(): void {
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
