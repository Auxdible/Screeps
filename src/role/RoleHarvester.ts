import {isTargeted} from "./manager/Creeps";
import {getCapital} from "../nation/Nation";
import {allSpotsList, generateSourceList} from "../nation/Mining";


export var roleHarvester = {
  /*
  * Harvester Role
  * Cost: 700 Energy
  *
  * Harvests statically from a source or outsourced source until death. gg ez
  * */
  run(creep: Creep) {
    if (!creep.memory.working) {

      if (creep.memory.target == null || Game.getObjectById(creep.memory.target) == null) {
        let sourcesId = generateSourceList().filter((source) => !isTargeted(source));
        let sources: any[] = [];
        sourcesId.forEach((src) => { sources.push(Game.getObjectById(src)); })
        const nearestSource = creep.pos.findClosestByPath(sources);
        if (nearestSource != null) {
          creep.memory.target = nearestSource.id;
          creep.memory.idle = false;
        } else {
          if (sources.length > 0) {
            creep.memory.target = sources[0].id;
            creep.memory.idle = false;
          } else {
            creep.memory.idle = true;
          }
        }
      }


      if (creep.memory.target != null && creep.harvest(Game.getObjectById(creep.memory.target)) != ERR_INVALID_TARGET && (creep.harvest(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE || creep.harvest(Game.getObjectById(creep.memory.target)) == ERR_NOT_ENOUGH_RESOURCES)) {
        creep.moveTo(Game.getObjectById(creep.memory.target), {
          visualizePathStyle: {
            stroke: '#f1ff00',
            lineStyle: 'solid'
          }
        });
      }

      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        creep.say("💧 Drop");
        creep.memory.working = true;
      }

    } else {
      creep.drop(RESOURCE_ENERGY);
      if (creep.store[RESOURCE_ENERGY] <= 0) {
        creep.say("🔨 Harvesting");
        creep.memory.working = false;
      }
    }
  },
  bodyParts: [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
  name: 'Harvester',
  memoryName: 'harvester',
  amount: allSpotsList().length,
}


