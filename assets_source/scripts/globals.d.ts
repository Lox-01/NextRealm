// globals.d.ts
import * as THREE from 'three';
declare global {
  var playersCubes: object; // Declare the global variable and its type
  var monstersCubes: object; 
  var my_id: string; 
  var my_username: string; 
  var scene: THREE.Scene;
}

export {}; // This ensures the file is treated as a module
