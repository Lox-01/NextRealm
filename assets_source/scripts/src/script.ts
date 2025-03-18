import * as THREE from 'three';
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { io } from "socket.io-client"; // For client-side
// or
// import { Server } from "socket.io"; // For server-side

import { DamageNumber } from "./damagenumber";
import { PlayerCube, SockerPlayer as SocketPlayer } from "./player";
import { MonsterCube, SocketMonster } from "./monster";
import { tri } from "./shared";

export function scriptPage () { 
    globalThis.playersCubes = {};
    globalThis.monstersCubes = {};
    globalThis.my_id = (document.getElementById('session_id') as HTMLInputElement).value;
    globalThis.my_username = (document.getElementById('session_username') as HTMLInputElement).value;
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
    globalThis.scene = scene;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.layers.enableAll();
    const canvas = document.getElementById('gamecanvas') as HTMLCanvasElement;
    const renderer = new THREE.WebGLRenderer({ canvas });
    const labelRenderer = new CSS2DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    labelRenderer.domElement.style.zIndex = '101';
    document.body.appendChild(labelRenderer.domElement);
    let player:null | PlayerCube = null;
    
    const planeGeometry = new THREE.PlaneGeometry(10, 10);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x14213d });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -0.5;
    scene.add(plane);
    
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    
    window.addEventListener('mousemove', (event) => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const cubes = Object.values(playersCubes).map(player => player.cube).concat(Object.values(monstersCubes).map(monster => monster.cube));
        const intersects = raycaster.intersectObjects( cubes, false );
        if (intersects.length > 0) {
            const intersectedCube = intersects[0].object;
            for (const oplayer of Object.values(playersCubes)) {
                if (player && oplayer.cube == intersectedCube) {
                    if (tri(player.cube.position,oplayer.cube.position)) {
                        hovered = oplayer;
                    }
                    break;
                }
            }
            for (const omonster of Object.values(monstersCubes)) {
                if (player &&  omonster.cube == intersectedCube) {
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

    socket.on("render_players", (players: { [id: number]: SocketPlayer }) => {
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
            monstersCubes[mon.id].startLerpToPosition(mon.pos);
            monstersCubes[mon.id].updateRotation(mon.rot);
        }
    });

    socket.on("player_dead", (player) => {
        if (playersCubes[player.id]) {
            playersCubes[player.id].handleDeath();
        }
        if (player.id == my_id) {
            playersCubes[player.id].showDeathMessage(socket);
        }
    });

    socket.on("monster_dead", (monster) => {
        console.log(monster.id);
        console.log(monstersCubes);
    });

    socket.on("render_monsters", (mons: { [id: number]: SocketMonster }) => {
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
        if(chatobj){
            chatobj.appendChild(messageElement);
        
            const isAtBottom = Math.abs(chatobj.scrollHeight - chatobj.scrollTop - chatobj.clientHeight) < 1;
            if (isAtBottom) {
                chatobj.scrollTop = chatobj.scrollHeight;
            }
        
            if (chatobj.childElementCount > 60) {
                const excessMessages = chatobj.childElementCount - 60;
                for (let i = 0; i < excessMessages; i++) {
                    if (chatobj.firstChild) {
                        if (chatobj.firstChild) {
                            chatobj.firstChild.remove();
                        }
                    }
                }
            }
        }
    });

    socket.on("private_msg", (vals) => {
        if (vals[1] == my_username || vals[2] == my_username) {
            const messageElement = document.createElement('div');
            messageElement.innerHTML = formatMessage(vals, true);
            messageElement.classList.add('message-container');
            if(chatobj){
                chatobj.appendChild(messageElement);
                const isAtBottom = chatobj.scrollHeight - chatobj.scrollTop === chatobj.clientHeight;
                if (isAtBottom) {
                    chatobj.scrollTop = chatobj.scrollHeight;
                }
                if (chatobj.childElementCount > 60) {
                    while (chatobj.childElementCount > 60) {
                        if (chatobj.firstChild) {
                            chatobj.firstChild.remove();
                        }
                    }
                }
            }
        }
    });
    
    socket.on("pm_fail", (failid) => {
        if (failid == my_username) {
            const messageElement = document.createElement('div');
            messageElement.textContent = 'The format for a private message is: "/pm target_id message". Please try again.';
            if(chatobj){
                chatobj.appendChild(messageElement);
                const isAtBottom = chatobj.scrollHeight - chatobj.scrollTop === chatobj.clientHeight;
                if (isAtBottom) {
                    chatobj.scrollTop = chatobj.scrollHeight;
                }
                if (chatobj.childElementCount > 60) {
                    while (chatobj.childElementCount > 60) {
                        if (chatobj.firstChild) {
                            chatobj.firstChild.remove();
                        }
                    }
                }
            }
        }
    });
    let spellconversion = {"1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine","10":"ten"};
    let spellcools = {"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true};
    socket.on("refresh_spell", (info) => {
        if (info[0] == my_id) {
            spellcools[`${info[1]}`] = true;
            const spellElement = document.getElementById("spellone");
            if (spellElement && Array.from(spellElement.classList).includes("dark")) {
                const spellElement = document.getElementById(`spell${spellconversion[`${info[1]}`]}`);
                if (spellElement) {
                    spellElement.classList.remove("dark");
                }
            }
        }
    });
              
    window.addEventListener("beforeunload", function(e) {
        socket.emit("offline", [my_id, localStorage.getItem('client_id')]);
    });
    let pressed: string[] = [];
    
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
            if (Object.keys(playersCubes).length > 0) {
                for (const [id, oplayer] of Object.entries(playersCubes)) {
                    oplayer.updateLabel(tri(player.cube.position,oplayer.cube.position));
                }
            }
            if (Object.keys(monstersCubes).length > 0 && monstersCubes != null) {
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
                    if (enterInput) {
                        (enterInput as HTMLInputElement).value += event.key;
                        enterInput.focus();
                    }
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
                if (enterInput) {
                    enterInput.style.zIndex = '99';
                    enterInput.style.opacity = '0';
                }
                if(chatobj){
                    chatobj.style.opacity = '0.5';
                }
                clearInterval(repeatInterval);
                repeatInterval = null;
            } else {
                chatopen = true;
                if (enterInput) {
                    enterInput.style.zIndex = '101';
                    enterInput.style.opacity = '1';
                    enterInput.focus();
                }
                if(chatobj){
                    chatobj.style.opacity = '1';
                }
            }
        } else if (chatopen) {
            if (event.key === "Backspace") {
                if (enterInput) {
                    (enterInput as HTMLInputElement).value = (enterInput as HTMLInputElement).value.slice(0, -1);
                }
            }
        }
        if (event.key === "1" && !chatopen) {
            if (spellcools["1"] == true) {
                if (selected) {
                    if (selected.id != my_id) {
                        socket.emit("player_hit", [selected.id, my_id, selected.type]);
                        spellcools["1"] = false;
                        const spellOneElement = document.getElementById("spellone");
                        if (spellOneElement && !Array.from(spellOneElement.classList).includes("dark")) {
                            const spellOneElement = document.getElementById("spellone");
                            if (spellOneElement) {
                                spellOneElement.classList.add("dark");
                            }
                        }
                    }
                }
            }
        }
    });    

    if (enterInput) {
        enterInput.addEventListener("blur", (_event) => {
            if (chatopen && enterInput) {
                enterInput.focus();
            }
        });
    }

    window.addEventListener("click", (event) => {
        if (chatopen) {
            const clicked = event.target as HTMLElement;
            if (clicked && clicked.id !== "chat" && clicked.id !== "chatInput") {
                chatopen = false;
                if (enterInput) {
                    (enterInput as HTMLInputElement).value = "";
                    enterInput.style.zIndex = '99';
                    enterInput.style.opacity = '0';
                }
                if(chatobj){
                    chatobj.style.opacity = '0.5';
                }
                clearInterval(repeatInterval);
                repeatInterval = null;
            }
        }
    });
    
    function sendMessage() {
        
        if (enterInput) {
            const message = (enterInput as HTMLInputElement).value.trim();
            if (message) {
                socket.emit('new_msg', [message, my_username]);
                (enterInput as HTMLInputElement).value = "";
            }
        }
    }
    animate();
}
