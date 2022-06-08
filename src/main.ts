// IMPORTS
import { ErrorMapper } from "utils/ErrorMapper";
import {getEconomy, printEconomyStatus} from "./nation/Nation";
import {spawnCreep, findAvailableSpawn} from "./structures/Spawn";
import { roles } from "./role/manager/Roles";

import {Creeps} from "./role/manager/Creeps";
import {allSpotsList, amountCanMine} from "./nation/locations/Mining";
import {tower} from "./structures/Tower";
import {Attack, getAttack} from "./nation/Attack";
import { MemoryManager } from "./utils/MemoryManager";
import {link} from "./structures/Link";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* main.ts | Main Script
* */

/*
* printEco();
* Executes printEconomyStatus(); from Nation.ts
* */
export const printEco = function() { printEconomyStatus(); }
/*
* createAttack();
* Passes the parameters through an Attack.ts/Attack object and returns the new object.
* */
export const createAttack = function(roomId: string, squadron: string[], rendezvous: RoomPosition) { return new Attack(roomId, squadron, rendezvous, false, 0, false); }

/*
* startAttack();
* Starts an attack using an id parameter
* */
export const startAttack = function(attackId: number) {
  if (getAttack(attackId) != null) {
    getAttack(attackId)?.initiateAttack();
  }
}
/*
* getSpawnableEnergy();
* Takes a room and will loop through all Extensions and Spawns to find the amount of energy that can be used to spawn.
* */
export const getSpawnableEnergy = function (room: Room) {
  let spawnableEnergy = 0;
  room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_SPAWN || str.structureType == STRUCTURE_EXTENSION})
    .forEach((src) => {
      if ("store" in src) {
        let store = src.store.getCapacity(RESOURCE_ENERGY);
        spawnableEnergy += src.store[RESOURCE_ENERGY];
      }});
  return spawnableEnergy;
}

/*
* getBodyCost();
* Takes a BodyPartConstant array and will return the sum of the cost of the contents.
* */
export const getBodyCost = function(bodyArray: BodyPartConstant[]) {
  let sum = 0;
  for (let i in bodyArray)
    sum += BODYPART_COST[bodyArray[i]];
  return sum;
}


/*
* roles();
* Grabs the roles map from Roles.ts
* */
export const getRoles = roles();

/*
* claimRoom();
* Takes a room id string and will spawn a claimer to claim it.
* */
export const claimRoom = function(roomId: string) {
  findAvailableSpawn("claim");
  Memory.claimRoom = roomId;
}

/*
* loop()
* Looped every 1 tick in the Screeps world. Uses ErrorMapper for stacktrace.
* */
export const loop = ErrorMapper.wrapLoop(() => {

  // Purge Memory
  MemoryManager.purgeMemory();

  // Loop through attacks to scan for dead attacks.
  for (let attack of Memory.attacks) {
    if (attack == null) {
      Memory.attacks.splice(Memory.attacks.indexOf(attack), 1);
    } else {
      if (attack.squadron.length <= 0 && attack.started) {
        Memory.attacks.splice(Memory.attacks.indexOf(attack), 1);
      }
      for (let squad of attack.squadron) {
        if (!Game.creeps[squad.name]) {
          attack.squadron.splice(attack.squadron.indexOf(squad), 1);
          delete Memory.creeps[squad.name];
        }
      }
    }
  }

  // If the economy is having an emergency, spawn a recovery unit.
  if (getEconomy().status == 1) {
    if (Creeps.getAmountNoQueue("recovery") < roles().get("recovery").amount) {
      for (let spawn of Object.keys(Game.spawns)) {
        let spawnObj = Game.spawns[spawn];
        if (spawnObj.memory.queue.length != 0) {
          for (let spawned of spawnObj.memory.queue) {
            if (spawned != "recovery") {
              spawnObj.memory.queue.splice(spawnObj.memory.queue.indexOf(spawned), 1);
            }
          }
        }
      }
    }
    if (Creeps.getAmount("recovery") < roles().get("recovery").amount) {
      findAvailableSpawn("recovery");
    }
  }

  // Queue roles
  let keys = Array.from(roles().keys()).filter((role) => roles().get(role).autoSpawn && (roles().get(role).amount > Creeps.getAmount(role)));
  keys = keys.sort((a, b) => { return roles().get(a).amount-roles().get(b).amount})
  for (let name of keys) {
    findAvailableSpawn(name);
  }

  // Run through spawns, queue, etc.
  for (const spawn of Object.keys(Game.spawns)) {
    const spawnObj = Game.spawns[spawn];
    if (spawnObj != null) {
      if (spawnObj.spawning == null && spawnObj.memory.queue.length > 0 && spawnObj.memory.queue[0] != null && getBodyCost(roles().get(spawnObj.memory.queue[0]).bodyParts) <= getSpawnableEnergy(spawnObj.room)) {
        spawnCreep(spawnObj, roles().get(spawnObj.memory.queue[0]));
        spawnObj.memory.queue.shift();
      }
      spawnObj.room.visual.text(`Queue: ${spawnObj.memory.queue.length}`, spawnObj.pos.x, spawnObj.pos.y - 1.5, { stroke: "#b63156", font: "0.7 Times New Roman" });
    }
    }

  // Execute creeps based on the role contained in creep.memory.role.
  for (const creep of Object.keys(Game.creeps)) {
    const creepObj = Game.creeps[creep];
    const role = roles().get(creepObj.memory.role);
    if (role != null) {
        role.run(creepObj);
    }
  }

  // Run tower algorithm.
  for (const towers of Object.values(Game.structures).filter((str) => { return str.structureType == STRUCTURE_TOWER; })) {
    tower.run(towers as StructureTower);
  }

  // Run link algorithm
  for (const links of Object.values(Game.structures).filter((str) => { return str.structureType == STRUCTURE_LINK; })) {
    link.run(links as StructureLink);
  }

});
