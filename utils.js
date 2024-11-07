export function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

export function rtd(r) {
    return r * 180 / Math.PI;
}

export function dtr(d) {
    return d / 180 * Math.PI;
}

export function dir(t) {
    if ("object" != typeof t || null === t) {
        console.log("Input is not a valid object.");
        return;
    }
    let e = Object.getOwnPropertyNames(t);
    e.forEach(t => {
        console.log(`Property - ${t}`)
    });
    let o = Object.getPrototypeOf(t);
    for (; o;) {
        let r = Object.getOwnPropertyNames(o);
        r.forEach(t => {
            console.log(`Method - ${t}`)
        }), o = Object.getPrototypeOf(o)
    }
}

export function deffunc(n) {
    if ("function" != typeof n) {
        console.log("Input is not a valid function.");
        return;
    }
    let t = n.toString();
    console.log("Function Definition:");
    console.log(t);
}