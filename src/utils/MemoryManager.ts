// IMPORTS
import {Attack} from "../nation/Attack";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* MemoryManager.ts | Script for managing and adding variables to memory.
* */

/*
* Global Declaration
* Declare global variables to add to existing Memory, CreepMemory, SpawnMemory, etc. classes
* */
declare global {
  interface Memory {
    uuid: number;
    log: any;
    attacks: Attack[];
    claimRoom: string | null;
  }
  interface CreepMemory {
    role: string;
    working: boolean;
    target: Id<any> | String | null;
    idle: boolean;
    attackId: number | null;

  }
  interface SpawnMemory {
    capital: boolean;
    autoUpgradeController: boolean;
    allowsSpawn: boolean;
    queue: string[];
    mainLink: Id<any> | null;
  }

}

/*
* Static MemoryManager
* Contains purgeMemory(); class to purge all Memory of dead objects.
* */
export class MemoryManager {
    static purgeMemory() {
        for (let creepMemory of Object.keys(Memory.creeps)) {
          if (Game.creeps[creepMemory] == null) {
              delete Memory.creeps[creepMemory];
          }
        }
      for (let flagMemory of Object.keys(Memory.flags)) {
        if (Game.flags[flagMemory] == null) {
          delete Memory.creeps[flagMemory];
        }
      }
      for (let spawnMemory of Object.keys(Memory.spawns)) {
        if (Game.spawns[spawnMemory] == null) {
          delete Memory.creeps[spawnMemory];
        }
      }
      if (Memory.powerCreeps != null || Memory.powerCreeps != undefined) {
        for (let powerCreepMemory of Object.keys(Memory.powerCreeps)) {
          if (Game.powerCreeps[powerCreepMemory] == null) {
            delete Memory.creeps[powerCreepMemory];
          }
        }
      }
    }
}
