import { ErrorMapper } from "utils/ErrorMapper";
import {getEconomy, printEconomyStatus} from "./nation/Nation";
import {spawnCreep, findAvailableSpawn} from "./spawns/Spawn";
import { roles } from "./role/manager/Roles";

import {getAmount, getAmountNoQueue} from "./role/manager/Creeps";
import {allSpotsList, amountCanMine} from "./nation/locations/Mining";
import {tower} from "./nation/Tower";
import {Attack} from "./nation/Attack";
import {getCost} from "./utils/BodyCost";
import {getSpawnableEnergy} from "./utils/SpawnableEnergy";

declare global {

  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  interface Memory {
    uuid: number;
    log: any;
    attacks: Attack[];
  }
  interface CreepMemory {
    role: string;
    working: boolean;
    target: Id<any> | null;
    idle: boolean;
    attackId: number | null;
  }
  interface SpawnMemory {
    capital: boolean;
    autoUpgradeController: boolean;
    allowsSpawn: boolean;
    queue: string[];
  }

}
export const printEco = function() {
  printEconomyStatus();
}
export const createAttack = function(roomId: string, squadron: string[], rendezvous: RoomPosition) {
  return new Attack(roomId, squadron, rendezvous, false, 0, false);
}
export const getAttack = function(attackId: number) {
  for (const attack of Memory.attacks) {
    if (attack.attackId == attackId) {
      return new Attack(attack.roomId, attack.squadronType, attack.rendezvous, true, attack.attackId, attack.started);
    }
  }
  return null;
}

/*
* ErrorMapper wraps loop.
* Screeps loop.
* */

export const getRoles = roles();
export const loop = ErrorMapper.wrapLoop(() => {
  /*
  * Handle outsourced mining
  * */
  for (var attack of Memory.attacks) {
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
  /*
  * Spawning
  * */

  if (getEconomy().status == 1) {
    if (getAmountNoQueue("recovery") < roles().get("recovery").amount) {
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
    if (getAmount("recovery") < roles().get("recovery").amount) {

      findAvailableSpawn("recovery");
    }

  }
    let keys = Array.from(roles().keys()).filter((role) => roles().get(role).autoSpawn && (roles().get(role).amount > getAmount(role)));
    keys = keys.sort((a, b) => { return roles().get(a).amount-roles().get(b).amount})
    for (let name of keys) {
        findAvailableSpawn(name);
    }

  for (const spawn of Object.keys(Game.spawns)) {
    const spawnObj = Game.spawns[spawn];


    if (spawnObj != null && spawnObj.spawning == null && spawnObj.memory.queue.length > 0 && getCost(roles().get(spawnObj.memory.queue[0]).bodyParts) <= getSpawnableEnergy(spawnObj.room)) {
        spawnCreep(spawnObj, roles().get(spawnObj.memory.queue[0]));
        spawnObj.memory.queue.shift();
      }
    }
  /*
  * Creeps
  */
  for (const creep of Object.keys(Game.creeps)) {
    const creepObj = Game.creeps[creep];
    const role = roles().get(creepObj.memory.role);
    if (role != null) {
      role.run(creepObj);
    }
  }
   /*
  * Towers
  * */
  for (const towers of Object.values(Game.structures).filter((str) => { return str.structureType == STRUCTURE_TOWER; })) {
    tower.run(<StructureTower> towers);
  }


});
