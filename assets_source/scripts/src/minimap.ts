type MinimapIcon = {
    element: HTMLDivElement;
    isRotatable?: boolean;
};

export class Minimap {
    private container: HTMLDivElement;
    private mapLayer: HTMLDivElement;
    public icons: Map<string, MinimapIcon>;
    private mapSize: number;
    private worldSize: number;
    private scale: number;

    constructor(
        containerId: string,
        mapSize: number = 200,
        worldSize: number = 100
    ) {
        // Map container
        this.container = document.getElementById(containerId) as HTMLDivElement;
        this.container.style.position = "relative";
        this.container.style.width = `${mapSize}px`;
        this.container.style.height = `${mapSize}px`;
        this.container.style.borderRadius = "50%";
        this.container.style.overflow = "hidden";
        this.container.style.border = "1px solid #fff";

        // Background map layer
        this.mapLayer = document.createElement("div");
        this.mapLayer.style.position = "absolute";
        this.mapLayer.style.width = `${mapSize}px`;
        this.mapLayer.style.height = `${mapSize}px`;
        this.mapLayer.style.background = "rgba(0,0,0,0.3)";
        this.container.appendChild(this.mapLayer);

        this.icons = new Map();
        this.mapSize = mapSize;
        this.worldSize = worldSize;
        this.scale = mapSize / worldSize;
    }

    addIcon(
        id: string,
        colorOrSvg: string = "red",
        size: number = 8,
        isRotatable = false
    ) {
        if (this.icons.has(id)) return;

        const el = document.createElement("div");
        el.style.position = "absolute";
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.transform = "translate(-50%, -50%)";

        if (colorOrSvg.endsWith(".svg")) {
            el.style.backgroundImage = `url(${colorOrSvg})`;
            el.style.backgroundSize = "contain";
            el.style.backgroundRepeat = "no-repeat";
        } else {
            el.style.background = colorOrSvg;
            el.style.borderRadius = "50%";
        }

        this.mapLayer.appendChild(el);
        this.icons.set(id, { element: el, isRotatable });
    }

    updateIcon(id: string, x: number, z: number, rotation: number = 0) {
        const icon = this.icons.get(id);
        if (!icon) return;

        const px = (x + this.worldSize / 2) * this.scale;
        // invert z axis to match typical top-down map orientation
        const pz = (-z + this.worldSize / 2) * this.scale;

        if (icon.isRotatable) {
            icon.element.style.transform = `translate(-50%, -50%) rotate(${rotation}rad)`;
        } else {
            icon.element.style.transform = `translate(-50%, -50%)`;
        }

        icon.element.style.left = `${px}px`;
        icon.element.style.top = `${pz}px`;
    }

    centerOnPlayer(x: number, z: number) {
        const px = (x + this.worldSize / 2) * this.scale;
        const pz = (-z + this.worldSize / 2) * this.scale;

        this.mapLayer.style.left = `${this.mapSize / 2 - px}px`;
        this.mapLayer.style.top = `${this.mapSize / 2 - pz}px`;
    }

    removeIcon(id: string) {
        const icon = this.icons.get(id);
        if (!icon) return;
        this.mapLayer.removeChild(icon.element);
        this.icons.delete(id);
    }
}
