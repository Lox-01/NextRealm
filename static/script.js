function getRandomInt(min, max) {const minCeiled = Math.ceil(min);const maxFloored = Math.floor(max);return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);}
function rtd(r) {return r * 180 / Math.PI;}
function dtr(d) {return d / 180 * Math.PI;}
function dir(t) {if ("object" != typeof t || null === t) {console.log("Input is not a valid object.");return;}let e = Object.getOwnPropertyNames(t);e.forEach(t => {console.log(`Property - ${t}`)});let o = Object.getPrototypeOf(t);for (; o;) {let r = Object.getOwnPropertyNames(o);r.forEach(t => {console.log(`Method - ${t}`)}), o = Object.getPrototypeOf(o)}}
function deffunc(n) {if ("function" != typeof n) {console.log("Input is not a valid function.");return;}let t = n.toString();console.log("Function Definition:");console.log(t);}

class PlayerCube {
    constructor(id, position, rotation, hp) {
        this.id = id;
        this.hp = hp;
        this.cube = this.createCube();
        this.updatePosition(position);
        this.updateRotation(rotation);
    }
    createCube() {
        const geometry = new THREE.BoxGeometry();
        const material = [
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
            new THREE.MeshBasicMaterial({ color: 0xff0000 }),
            new THREE.MeshBasicMaterial({ color: 0x0000ff })
        ];
        const cubeMesh = new THREE.Mesh(geometry, material);
        cubeMesh.name = this.id;
        return cubeMesh;
    }
    updatePosition(position) {
        this.cube.position.set(position.x, position.y, position.z);
    }
    updateRotation(rotation) {
        this.cube.rotation.set(rotation.xr, rotation.yr, rotation.zr);
    }

    updateHp(hp) {
        this.hp = hp;
    }
}
document.addEventListener("DOMContentLoaded", (event) => {
    const playersCubes = {};
    let my_id = document.getElementById('session_id').value;
    let selected;
    let hovered;
    const url = window.location.href;
    const islocal = /^https?:\/\/localhost:8080(\/.*)?$/.test(url);
    if (islocal) {
        var socket = io('http://localhost:8080', {
            query: {
                player_id: my_id
            }
        });
    } else {
        var socket = io('http://45.90.12.32:6052', {
            query: {
                player_id: my_id
            }
        });
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const canvas = document.getElementById('gamecanvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const player = new PlayerCube(my_id, { x: 0, y: 1, z: 0 }, { xr: 0, yr: 0, zr: 0 }, 50);
    
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    scene.add(plane);
    
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    
    window.addEventListener('mousemove', (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects( Object.values(playersCubes).map(player => player.cube), false );
        if (intersects.length > 0) {
            const intersectedCube = intersects[0].object;
            for (const player of Object.values(playersCubes)) {
                if (player.cube == intersectedCube) {
                    hovered = player;
                    break;
                }
            }
        }
    });

    window.addEventListener("mouseup", (event) => {
        selected = hovered;
    });

    socket.on("render_players", (players) => {
        for (const [id, data] of Object.entries(players)) {
            if (id != my_id) {
                if (!playersCubes[id]) {
                    playersCubes[id] = new PlayerCube(id, data.position, data.rotation, data.hp);
                    scene.add(playersCubes[id].cube);
                } else {
                    playersCubes[id].updatePosition(data.position);
                    playersCubes[id].updateRotation(data.rotation);
                    playersCubes[id].updateHp(data.hp);
                }
            } else {
                player.updatePosition(data.position);
                player.updateRotation(data.rotation);
                player.updateHp(data.hp);
                if (!scene.getObjectByName(my_id)) {
                    scene.add(player.cube);
                    animate();
                }
            }
        }
        for (const [id, cube] of Object.entries(playersCubes)) {
            if (!players[id]) {
                scene.remove(cube.cube);
                if (cube.cube.geometry) {
                    cube.cube.geometry.dispose();
                }
                if (Array.isArray(cube.cube.material)) {
                    cube.cube.material.forEach(material => material.dispose());
                } else if (cube.cube.material) {
                    cube.cube.material.dispose();
                }
                if (playersCubes[id]) {
                    delete playersCubes[id];
                }
            }
        }
    });

    function formatMessage(vals) {
        const localDate = new Date(vals[2]);
        const formattedTime = localDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${formattedTime} ${vals[1]}: ${vals[0]}`;
    }

    socket.on("append_msg", (vals) => {
        const messageElement = document.createElement('div');
        messageElement.textContent = formatMessage(vals);
        chatobj.appendChild(messageElement);
        const isAtBottom = chatobj.scrollHeight - chatobj.scrollTop === chatobj.clientHeight;
        if (isAtBottom) {
            chatobj.scrollTop = chatobj.scrollHeight;
        }
        if (chatobj.childElementCount > 60) {
            while (chatobj.childElementCount > 60) {
                chatobj.firstChild.remove();
            }
        }
    });

    socket.on("private_msg", (vals) => {
        if (vals[1] == my_id) {
            const messageElement = document.createElement('div');
            let newvals = vals;
            newvals.splice(1,1);
            messageElement.textContent = `Private message: ${formatMessage(newvals)}`;
            chatobj.appendChild(messageElement);
            const isAtBottom = chatobj.scrollHeight - chatobj.scrollTop === chatobj.clientHeight;
            if (isAtBottom) {
                chatobj.scrollTop = chatobj.scrollHeight;
            }
            if (chatobj.childElementCount > 60) {
                while (chatobj.childElementCount > 60) {
                    chatobj.firstChild.remove();
                }
            }
        }
    });
    
    socket.on("pm_fail", (failid) => {
        if (failid == my_id) {
            const messageElement = document.createElement('div');
            messageElement.textContent = 'The format for a private message is: "/pm target_id message". Please try again.';
            chatobj.appendChild(messageElement);
            const isAtBottom = chatobj.scrollHeight - chatobj.scrollTop === chatobj.clientHeight;
            if (isAtBottom) {
                chatobj.scrollTop = chatobj.scrollHeight;
            }
            if (chatobj.childElementCount > 60) {
                while (chatobj.childElementCount > 60) {
                    chatobj.firstChild.remove();
                }
            }
        }
    });
    
    window.addEventListener("beforeunload", function(e) {
        socket.emit("offline", [my_id, localStorage.getItem('client_id')]);
    });
    let pressed = [];
    
    let isgrounded = false;
    
    function animate() {
        if (player.cube.position.y == 1) {
            isgrounded = true;
        } else {
            isgrounded = false;
        }
        requestAnimationFrame(animate);
        if (!chatopen) {
            let moved = false;
            if (pressed.includes('w')) {
                let a = player.cube.rotation.y;
                let b = Math.sin(a) / 20;
                let c = Math.cos(a) / 20;
                player.cube.position.z += c;
                player.cube.position.x += b;
                moved = true;
            }
            if (pressed.includes('s')) {
                let a = player.cube.rotation.y;
                let b = -Math.sin(a) / 40;
                let c = -Math.cos(a) / 40;
                player.cube.position.z += c;
                player.cube.position.x += b;
                moved = true;
            }
            if (pressed.includes('a')) {
                player.cube.rotation.y += Math.PI / 150;
                moved = true;
            }
            if (pressed.includes('d')) {
                player.cube.rotation.y -= Math.PI / 150;
                moved = true;
            }
            
            if (moved === true) {
                let data = { "id": my_id, "pos": { "x": player.cube.position.x, "y": player.cube.position.y, "z": player.cube.position.z }, "rot": { "xr": player.cube.rotation.x, "yr": player.cube.rotation.y, "zr": player.cube.rotation.z } };
                socket.emit('player_move', data);
            }
        }
        camera.position.x = player.cube.position.x - Math.sin(player.cube.rotation.y) * 4;
        camera.position.z = player.cube.position.z - Math.cos(player.cube.rotation.y) * 4;
        camera.position.y = player.cube.position.y + 3;
        camera.lookAt(player.cube.position);
        renderer.render(scene, camera);
    }
    
    let repeatInterval;

    window.addEventListener('keydown', (event) => {
        if (!pressed.includes(event.key)) {
            pressed.push(event.key);
        }
        if (chatopen && event.key.length === 1) {
            if (!repeatInterval) {
                repeatInterval = setInterval(() => {
                    enterInput.value += event.key;
                    enterInput.focus();
                }, 200);
            }
        }
    });

    let chatobj = document.getElementById("chat");
    let enterInput = document.getElementById("chatInput");
    let chatopen = false;
    window.addEventListener('keyup', (event) => {
        pressed = pressed.filter(key => key !== event.key);
        if (event.key.length === 1 && chatopen) {
            clearInterval(repeatInterval);
            repeatInterval = null;
        }
        if (event.key === "Enter") {
            if (chatopen) {
                sendMessage();
                chatopen = false;
                enterInput.style.zIndex = 99;
                chatobj.style.opacity = 0.5;
                enterInput.style.opacity = 0;
                clearInterval(repeatInterval);
                repeatInterval = null;
            } else {
                chatopen = true;
                enterInput.style.zIndex = 101;
                chatobj.style.opacity = 1;
                enterInput.style.opacity = 1;
                enterInput.focus();
            }
        } else if (chatopen) {
            if (event.key === "Backspace") {
                enterInput.value = enterInput.value.slice(0, -1);
            }
        }
        if (event.key === "1" && !chatopen) {
            if (selected) {
                socket.emit("player_hit", selected.id);
            }
        }
    });    

    enterInput.addEventListener("blur", (event) => {
        if (chatopen) {
            enterInput.focus();
        }
    });

    window.addEventListener("click", (event) => {
        if (chatopen) {
            const clicked = event.target;
            if (clicked.id != "chat" && clicked.id != "chatInput") {
                chatopen = false;
                enterInput.value = "";
                enterInput.style.zIndex = 99;
                chatobj.style.opacity = 0.5;
                enterInput.style.opacity = 0;
                clearInterval(repeatInterval);
                repeatInterval = null;
            }
        }
    });
    
    function sendMessage() {
        const message = enterInput.value.trim();
        if (message) {
            const gmttime = Date.now();
            socket.emit('new_msg', [message, my_id, gmttime]);
            enterInput.value = "";
        }
    }
    animate();
});
