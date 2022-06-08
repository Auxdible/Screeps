// IMPORTS
import {Creeps} from "./manager/Creeps";
import {allSpotsList, generateSourceList} from "../nation/locations/Mining";
import {getCapital} from "../nation/Nation";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* RoleHarvester.ts | Script for harvester role logic
* */

export var roleHarvester = {
  /*
  * Harvester Role
  * Cost: 600 Energy
  *
  * Harvests statically from a source or outsourced source until death. gg ez
  * */
  run(creep: Creep) {
    if (!creep.memory.working) {

      if (creep.memory.target == null || Game.getObjectById(creep.memory.target as Id<any>) == null) {
        let sourcesId = generateSourceList().filter((source) => !Creeps.isTargeted(source));
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


      if (creep.memory.target != null && creep.harvest(Game.getObjectById(creep.memory.target as Id<any>)) != ERR_INVALID_TARGET && (creep.harvest(Game.getObjectById(creep.memory.target as Id<any>)) == ERR_NOT_IN_RANGE || creep.harvest(Game.getObjectById(creep.memory.target as Id<any>)) == ERR_NOT_ENOUGH_RESOURCES)) {
        Creeps.pathFind(creep, Game.getObjectById(creep.memory.target as Id<any>).pos, '#f1ff00', 'solid');
      }

      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        creep.say("💧 Drop");
        creep.memory.working = true;
      }

    } else {
      let links = creep.pos.findInRange(creep.room.find(FIND_STRUCTURES, { filter: (str) => { return str.structureType == STRUCTURE_LINK; } }), 2);
      let capital = getCapital(creep.room);
      if (links.length > 0) {
        let nearestLink = creep.pos.findClosestByPath(links) as StructureLink;
        if (creep.transfer(nearestLink, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          Creeps.pathFind(creep, Game.getObjectById(creep.memory.target as Id<any>).pos, '#f1ff00', 'solid');
        }
      } else {
        creep.drop(RESOURCE_ENERGY);
      }
      if (creep.store[RESOURCE_ENERGY] <= 0) {
        creep.say("🔨 Harvesting");
        creep.memory.working = false;
      }
    }
  },
  bodyParts: [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK],
  name: 'Harvester',
  memoryName: 'harvester',
  amount: allSpotsList().length,
  autoSpawn: true,
}


