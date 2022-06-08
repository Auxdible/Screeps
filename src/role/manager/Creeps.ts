// IMPORTS
import {amountCanMine} from "../../nation/locations/Mining";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* Creeps.ts | Contains multiple methods that use a Creep object.
* */
export class Creeps {
  /*
  * findAttackTarget();
  * Takes a creep parameter and based on the environment will return either a Creep, RoomObject, or Structure
  * */
  static findAttackTarget = function(creep: Creep) {
    /*
    * Attack Priorities
    * Tower
    * Spawn
    * Extensions
    * Creeps
    * Other Structures
    * */
    let towers = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: (str) => { return str.structureType == STRUCTURE_TOWER; } });
    let spawns = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: (str) => { return str.structureType == STRUCTURE_SPAWN; } });
    let extensions = creep.room.find(FIND_HOSTILE_STRUCTURES, { filter: (str) => { return str.structureType == STRUCTURE_EXTENSION; } });
    let creeps = creep.room.find(FIND_HOSTILE_CREEPS);
    let otherStructures = creep.room.find(FIND_HOSTILE_STRUCTURES);
    if (towers.length > 0) {
      return creep.pos.findClosestByPath(towers);
    } else if (spawns.length > 0) {
      return creep.pos.findClosestByPath(spawns);
    } else if (extensions.length > 0) {
      return creep.pos.findClosestByPath(extensions);
    } else if (creeps.length > 0) {
      return creep.pos.findClosestByPath(creeps);
    } else if (otherStructures.length > 0) {
      return creep.pos.findClosestByPath(otherStructures);
    } else {
      return null;
    }
  }

  /*
  * getAmount();
  * Returns the amount of creeps with a specific role, using the memoryName as an identifier, including creeps in the queue.
  * */
  static getAmount = function(memoryName: string) {
    let amount = 0;
    for (const name of Object.keys(Game.creeps)) {
      if (Game.creeps[name].memory.role == memoryName) {
        amount++;
      }

    }
    for (const spawn of Object.keys(Game.spawns)) {
      let spawnObj = Game.spawns[spawn];
      for (const queue of spawnObj.memory.queue) {
        if (queue == memoryName) {
          amount++;
        }
      }
    }
    return amount;
  }

  /*
  * getAmountNoQueue();
  * Returns the amount of creeps with a specific role, using the memoryName as an identifier, excluding creeps that are in the queue.
  * */
  static getAmountNoQueue = function(memoryName: string) {
    let amount = 0;
    for (const name of Object.keys(Game.creeps)) {
      if (Game.creeps[name].memory.role == memoryName) {
        amount++;
      }

    }
    return amount;
  }

  /*
  * isTargeted();
  * Returns if an object has too many or not too many targets.
  * */
  static isTargeted = function(target: Id<any>) {
    const targets = new Map();
    const notSelectable: any[] = []
    for (const name of Object.keys(Game.creeps)) {
      let creep = Game.creeps[name];

      if (creep.memory.target != null && creep.memory.target == target) {
        if (targets.get(creep.memory.target) == null) {
          targets.set(creep.memory.target, 0);
        } else { targets.set(creep.memory.target, targets.get(creep.memory.target) + 1); }
        if (!(Game.getObjectById(creep.memory.target as Id<any>) instanceof Source)) {
          if (targets.get(creep.memory.target) >= 1) {
            notSelectable.push(creep.memory.target)
          }
        } else {
          if (targets.get(creep.memory.target) >= amountCanMine(Game.getObjectById(target), false)) {
            notSelectable.push(creep.memory.target);
          }
        }

        if (notSelectable.includes(target)) {
          return true;
        }
      }
    }
    return false;
  }
  static pathFind = function(creep: Creep, pos: RoomPosition, pathStroke: string, pathType: string) {

      let outsourcedRoute = Game.map.findRoute(creep.room.name, pos.roomName);
      if (creep.room.name == pos.roomName) {
        creep.moveTo(pos)
      } else if (outsourcedRoute != -2) {
        const route = creep.pos.findClosestByPath(outsourcedRoute[0].exit);
        creep.moveTo(route as RoomPosition, {
          visualizePathStyle: {
            stroke: pathStroke,
            lineStyle: pathType as "dashed" | "dotted" | "solid" | undefined
          }
        });
      }


  }
}




