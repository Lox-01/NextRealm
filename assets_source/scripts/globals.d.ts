// globals.d.ts
import { PlayerCube } from "./playerCube";
declare global {
  var playersCubes: Record<string, PlayerCube>; // Declare the global variable and its type
  var monstersCubes: object; 
  var my_id: string; 
  var my_username: string; 
}

export {}; // This ensures the file is treated as a module