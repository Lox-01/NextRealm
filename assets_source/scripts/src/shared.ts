export function tri(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

export function gri(min: number, max: number): number {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function rtd(r: number): number {
    return r * 180 / Math.PI;
}

export function dtr(d: number): number {
    return d / 180 * Math.PI;
}

export function dir(t: object | number): void {
    if (typeof t !== "object" || t === null) {
        console.log("Input is not a valid object.");
        return;
    }
    const e = Object.getOwnPropertyNames(t);
    e.forEach((prop) => {
        console.log(`Property - ${prop}`);
    });
    let o = Object.getPrototypeOf(t);
    while (o) {
        const r = Object.getOwnPropertyNames(o);
        r.forEach((method) => {
            console.log(`Method - ${method}`);
        });
        o = Object.getPrototypeOf(o);
    }
}

export function deffunc(n: Function): void {
    if (typeof n !== "function") {
        console.log("Input is not a valid function.");
        return;
    }
    const t = n.toString();
    console.log("Function Definition:");
    console.log(t);
}  