function gri(min, max) {const minCeiled = Math.ceil(min);const maxFloored = Math.floor(max);return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);}
function rtd(r) {return r * 180 / Math.PI;}
function dtr(d) {return d / 180 * Math.PI;}
function dir(t) {if ("object" != typeof t || null === t) {console.log("Input is not a valid object.");return;}let e = Object.getOwnPropertyNames(t);e.forEach(t => {console.log(`Property - ${t}`)});let o = Object.getPrototypeOf(t);for (; o;) {let r = Object.getOwnPropertyNames(o);r.forEach(t => {console.log(`Method - ${t}`)}), o = Object.getPrototypeOf(o)}}
function deffunc(n) {if ("function" != typeof n) {console.log("Input is not a valid function.");return;}let t = n.toString();console.log("Function Definition:");console.log(t);}
function tri(a,b) {return Math.sqrt((Number(a["x"])-Number(b["x"]))**2+(Number(a["y"])-Number(b["y"]))**2+(Number(a["z"])-Number(b["z"]))**2);}

let playersCubes;
let monstersCubes;
let my_id;
let my_username;
document.addEventListener("DOMContentLoaded", (event) => {
    playersCubes = {};
    monstersCubes = {};
    my_id = document.getElementById('session_id').value;
    my_username = document.getElementById('session_username').value;
    let selected;
    let hovered;
    const url = window.location.href;
    if (url.includes('localhost:6052') || url.includes('127.0.0.1:6052')) {
        var socket = io('http://localhost:6052', {
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
    camera.layers.enableAll();
    const canvas = document.getElementById('gamecanvas');
    const renderer = new THREE.WebGLRenderer({ canvas });
    const labelRenderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    document.body.appendChild(labelRenderer.domElement);
    let player = null;
    
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x14213d });
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
        cubes = Object.values(playersCubes).map(player => player.cube).concat(Object.values(monstersCubes).map(monster => monster.cube));
        const intersects = raycaster.intersectObjects( cubes, false );
        if (intersects.length > 0) {
            const intersectedCube = intersects[0].object;
            for (const oplayer of Object.values(playersCubes)) {
                if (oplayer.cube == intersectedCube) {
                    if (tri(player.cube.position,oplayer.cube.position)) {
                        hovered = oplayer;
                    }
                    break;
                }
            }
            for (const omonster of Object.values(monstersCubes)) {
                if (omonster.cube == intersectedCube) {
                    if (tri(player.cube.position,omonster.cube.position)) {
                        hovered = omonster;
                    }
                    break;
                }
            }
        } else {
            hovered = null;
        }
    });

    window.addEventListener("mouseup", (event) => {
        selected = hovered;
    });

    socket.on("update_threat", (data) => {
        const monster = monstersCubes[data.monsterid];
        if (monster) {
            monster.threats = data.threats;
        }
    });

    socket.on("render_players", (players) => {
        for (const [id, data] of Object.entries(players)) {
            if (!playersCubes[id]) {
                playersCubes[id] = new PlayerCube(id, data.pos, data.rot, data.hp, data.username, data.totalhp);
                scene.add(playersCubes[id].cube);
            } else {
                playersCubes[id].updatePosition(data.pos);
                playersCubes[id].updateRotation(data.rot);
                if (data.hp != playersCubes[id].hp) {
                    const damageNumber = new DamageNumber(scene, playersCubes[id], playersCubes[id].hp - data.hp);
                    setInterval(() => {
                        damageNumber.update();
                    }, 250);

                }
                playersCubes[id].updateHp(data.hp);
            }
            if (!player) {
                if (my_id == id) {
                    player = playersCubes[id]
                }
            }
        }
        for (const [id, cube] of Object.entries(playersCubes)) {
            if (!players[id]) {
                cube.cleanup();
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

    socket.on("monster_position_update", (mon) => {
        if (monstersCubes[mon.id]) {
            //monstersCubes[mon.id].updatePosition(mon.pos);
            monstersCubes[mon.id].startLerpToPosition(mon.pos);
            monstersCubes[mon.id].updateRotation(mon.rot);
        }
    });

    socket.on("render_monsters", (mons) => {
        for (const [id, data] of Object.entries(mons)) {
            if (!monstersCubes[id]) {
                monstersCubes[id] = new MonsterCube(id, data.name, data.hp, data.totalhp, data.attack, data.arange, data.cooldown, data.pos, data.rot, data.aggrorange, data.followrange, data.speed);
                scene.add(monstersCubes[id].cube);
            } else {
                //monstersCubes[id].updatePosition(data.pos);
                monstersCubes[id].startLerpToPosition(data.pos);
                monstersCubes[id].updateRotation(data.rot);
                if (data.hp != monstersCubes[id].hp) {
                    const damageNumber = new DamageNumber(scene, monstersCubes[id], monstersCubes[id].hp - data.hp);
                    setInterval(() => {
                        damageNumber.update();
                    }, 250);

                }
                monstersCubes[id].updateHp(data.hp);
            }
        }
    });

    function escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    
    function formatMessage(vals, p) {
        if (!p) {
            const sanitizedMessage = escapeHTML(vals[0]);
            return `<p class='name'>${vals[1]}</p><div class='message'><p class='text'>${sanitizedMessage}</p></div>`;
        } else {
            const sanitizedMessage = escapeHTML(vals[0]);
            return `<p class='name'>(PRIVATE) ${vals[1]} -> ${vals[2]}</p><div class='message'><p class='text'>${sanitizedMessage}</p></div>`
        }
    }
    
    socket.on("append_msg", (vals) => {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = formatMessage(vals, false);
        messageElement.classList.add('message-container');
        chatobj.appendChild(messageElement);
    
        const isAtBottom = Math.abs(chatobj.scrollHeight - chatobj.scrollTop - chatobj.clientHeight) < 1;
        if (isAtBottom) {
            chatobj.scrollTop = chatobj.scrollHeight;
        }
    
        if (chatobj.childElementCount > 60) {
            const excessMessages = chatobj.childElementCount - 60;
            for (let i = 0; i < excessMessages; i++) {
                chatobj.firstChild.remove();
            }
        }
    });

    socket.on("private_msg", (vals) => {
        if (vals[1] == my_username || vals[2] == my_username) {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = formatMessage(vals, true);
            messageElement.classList.add('message-container');
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
        if (failid == my_username) {
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
    let spellconversion = {"1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine","10":"ten"};
    let spellcools = {"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true};
    socket.on("refresh_spell", (info) => {
        if (info[0] == my_id) {
            spellcools[`${info[1]}`] = true;
            if (Array.from(document.getElementById("spellone").classList).includes("dark")) {
                document.getElementById(`spell${spellconversion[`${info[1]}`]}`).classList.remove("dark");
            }
        }
    });
              
    window.addEventListener("beforeunload", function(e) {
        socket.emit("offline", [my_id, localStorage.getItem('client_id')]);
    });
    let pressed = [];
    
    function animate() {
        requestAnimationFrame(animate);
        if (player) {
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
            camera.position.y = player.cube.position.y + 1.7;
            camera.lookAt(player.cube.position);
            if (playersCubes != {} && playersCubes != null) {
                for (const [id, oplayer] of Object.entries(playersCubes)) {
                    oplayer.updateLabel(tri(player.cube.position,oplayer.cube.position));
                }
            }
            if (monstersCubes != {} && monstersCubes != null) {
                for (const [id, omonster] of Object.entries(monstersCubes)) {
                    omonster.updateLabel(tri(player.cube.position,omonster.cube.position));
                    if (omonster.lerpStart && omonster.lerpTarget) {
                        const now = performance.now();
                        const t = Math.min(1, (now - omonster.lerpStartTime) / omonster.lerpDuration);
                        omonster.cube.position.lerpVectors(omonster.lerpStart, omonster.lerpTarget, t);
                        if (t === 1) {
                            omonster.lerpStart = null;
                            omonster.lerpTarget = null;
                        }
                    }
                }
            }
        }
        renderer.render(scene, camera);
        labelRenderer.render( scene, camera );
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
            if (spellcools["1"] == true) {
                if (selected) {
                    if (selected.id != my_id) {
                        socket.emit("player_hit", [selected.id, my_id, selected.type]);
                        spellcools["1"] = false;
                        if (!Array.from(document.getElementById("spellone").classList).includes("dark")) {
                            document.getElementById("spellone").classList.add("dark");
                        }
                    }
                }
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
            socket.emit('new_msg', [message, my_username]);
            enterInput.value = "";
        }
    }
    animate();
});
