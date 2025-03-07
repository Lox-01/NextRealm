class DamageNumber {
    constructor(scene, player, damage) {
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
        this.element.style.opacity = 1;
        this.css2dObject = new CSS2DObject(this.element);
        this.css2dObject.position.copy(player.cube.position);
        this.css2dObject.position.y += 1;
        this.scene.add(this.css2dObject);
    }
    update() {
        this.element.style.opacity -= 0.05;
        this.css2dObject.position.copy(this.player.cube.position);
        this.css2dObject.position.y+=2-this.element.style.opacity;
        if (this.element.style.opacity <= 0.5) {
            this.scene.remove(this.css2dObject);
        }
    }
}