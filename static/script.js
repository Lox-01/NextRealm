function gri(min, max) {const minCeiled = Math.ceil(min);const maxFloored = Math.floor(max);return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);}
function rtd(r) {return r * 180 / Math.PI;}
function dtr(d) {return d / 180 * Math.PI;}
function dir(t) {if ("object" != typeof t || null === t) {console.log("Input is not a valid object.");return;}let e = Object.getOwnPropertyNames(t);e.forEach(t => {console.log(`Property - ${t}`)});let o = Object.getPrototypeOf(t);for (; o;) {let r = Object.getOwnPropertyNames(o);r.forEach(t => {console.log(`Method - ${t}`)}), o = Object.getPrototypeOf(o)}}
function deffunc(n) {if ("function" != typeof n) {console.log("Input is not a valid function.");return;}let t = n.toString();console.log("Function Definition:");console.log(t);}
function tri(a,b) {return Math.sqrt((Number(a["x"])-Number(b["x"]))**2+(Number(a["y"])-Number(b["y"]))**2+(Number(a["z"])-Number(b["z"]))**2);}
class PlayerCube {
    constructor(id, position, rotation, hp, username, totalhp) {
        this.id = id;
        this.totalhp = totalhp;
        this.hp = hp;
        this.username = username;
        this.cube = this.createCube();
        this.label = this.createLabel();
        this.hpbar = this.createHpBar();
        this.updatePosition(position);
        this.updateRotation(rotation);
    }
    createCube() {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
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

    createLabel() {
        const playerDiv = document.createElement('div');
        playerDiv.className = 'label';
        playerDiv.textContent = `${this.username}`;
        playerDiv.style.backgroundColor = 'transparent';
        const playerLabel = new CSS2DObject( playerDiv );
        playerLabel.position.set( 0, 0, 0 );
        playerLabel.center.set( 0.5, 4.5 );
        this.cube.add( playerLabel );
        playerLabel.layers.set( 0 );
        playerLabel.element.style.fontSize="30px";
        return playerLabel;
    }

    createHpBar() {
        const playerHpBarBack = document.createElement('div');
        const playerHpBarFront = document.createElement('div');
        playerHpBarBack.className = 'hpback';
        playerHpBarFront.className = 'hpfront';
        playerHpBarBack.appendChild(playerHpBarFront);
        const playerBar = new CSS2DObject( playerHpBarBack );
        playerHpBarBack.style.width = '200px';
        playerHpBarBack.style.height = '20px';
        playerBar.position.set( 0, 0, 0 );
        playerBar.center.set( 0.5, 6.5 );
        this.cube.add( playerBar );
        playerBar.layers.set( 0 );
        return playerBar;
    }

    updatePosition(position) {
        this.cube.position.set(position.x, position.y, position.z);
    }
    updateRotation(rotation) {
        this.cube.rotation.set(rotation.xr, rotation.yr, rotation.zr);
    }

    updateHp(hp) {
        this.hp = hp;
        let percentageHp = this.hp/this.totalhp*100;
        this.hpbar.element.getElementsByClassName("hpfront")[0].style.width = `${percentageHp}%`;
    }

    updateLabel(distance) {
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
            const scaleFactor = 1/(1+0.07*distance);
            this.label.element.style.fontSize = `${scaleFactor*30}px`;
            this.hpbar.element.style.width = `${200 * scaleFactor}px`;
            this.hpbar.element.style.height = `${20 * scaleFactor}px`;
            this.label.center.set(0.5,4.5-distance*0.04);
            this.hpbar.center.set(0.5,6.5-distance*0.05);
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
}
document.addEventListener("DOMContentLoaded", (event) => {
    const playersCubes = {};
    let my_id = document.getElementById('session_id').value;
    let my_username = document.getElementById('session_username').value;
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
            if (!playersCubes[id]) {
                playersCubes[id] = new PlayerCube(id, data.position, data.rotation, data.hp, data.username, data.totalhp);
                scene.add(playersCubes[id].cube);
            } else {
                playersCubes[id].updatePosition(data.position);
                playersCubes[id].updateRotation(data.rotation);
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
    let spellconversion = {"1":"one","2":"two","3":"three","4":"four","5":"five","6":"six","7":"seven","8":"eight","9":"nine","10":"ten"};
    let spellcools = {"1":true,"2":true,"3":true,"4":true,"5":true,"6":true,"7":true,"8":true,"9":true,"10":true};
    socket.on("refresh_spell", (info) => {
        console.log(info);
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
    
    let isgrounded = false;
    
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
                        socket.emit("player_hit", [selected.id, my_id]);
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
            const gmttime = Date.now();
            socket.emit('new_msg', [message, my_id, gmttime]);
            enterInput.value = "";
        }
    }
    animate();
});
