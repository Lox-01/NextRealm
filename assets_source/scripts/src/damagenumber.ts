import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { tri } from './shared';

export class DamageNumber {
    scene: any;
    player: any;
    damage: number;
    element: HTMLDivElement;
    css2dObject: any;

    constructor(scene: any, player: any, damage: number) {
        this.scene = scene;
        this.player = player;
        this.damage = damage;
        this.element = document.createElement('div');
        this.element.textContent = damage.toString();
        this.element.style.position = 'absolute';
        this.element.style.top = '0px';
        this.element.style.left = '0px';
        this.element.style.fontSize = `${1/(1+0.07*tri(playersCubes[my_id].cube.position,player.cube.position))*30}px`;
        this.element.style.color = 'red';
        this.element.style.fontWeight = 'bold';
        this.element.style.opacity = damage < 0 ? '0' : '1';
        this.css2dObject = new CSS2DObject(this.element);
        this.css2dObject.position.copy(player.cube.position);
        this.css2dObject.position.y += 1;
        this.scene.add(this.css2dObject);
    }
    update() {
        if (parseFloat(this.element.style.opacity) > 0) {
            this.element.style.opacity = (parseFloat(this.element.style.opacity) - 0.05).toString();
        }
        this.css2dObject.position.copy(this.player.cube.position);
        this.css2dObject.position.y += 2 - parseFloat(this.element.style.opacity);
        if (parseFloat(this.element.style.opacity) <= 0.5) {
            this.scene.remove(this.css2dObject);
        }
    }
}