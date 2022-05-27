import { ErrorMapper } from "utils/ErrorMapper";
import {getEconomy, printEconomyStatus} from "./nation/Nation";
import {autoSpawn} from "./spawns/Spawn";
import { roles } from "./role/manager/Roles";

import {getAmount} from "./role/manager/Creeps";
import {allSpotsList, amountCanMine} from "./nation/OutsourcedMining";
import {tower} from "./nation/Tower";

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
  }
  interface CreepMemory {
    role: string;
    working: boolean;
    target: Id<any> | null;
    idle: boolean;
  }
  interface SpawnMemory {
    capital: boolean;
    autoUpgradeController: boolean;
    allowsSpawn: boolean;
  }

}

/*
* ErrorMapper wraps loop.
* Screeps loop.
* */

export const loop = ErrorMapper.wrapLoop(() => {
  /*
  * Handle outsourced mining
  * */
  /*
  * Spawning
  * */

  for (const spawn of Object.keys(Game.spawns)) {
    const spawnObj = Game.spawns[spawn];

    if (spawnObj != null && spawnObj.spawning == null) {
      if (getEconomy().status == 1) {
        autoSpawn(roles().get("recovery"));
      }

      for (let name of roles().keys()) {
          if (roles().get(name) != null && name != "recovery" && getAmount(name) < roles().get(name).amount) {

            autoSpawn(roles().get(name));
          }
        }
      }
    }
  /*
  * Creeps
  */
  for (const creep of Object.keys(Game.creeps)) {
    const creepObj = Game.creeps[creep];
    // @ts-ignore
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
