// IMPORTS
import {Creeps} from "./manager/Creeps";
import {generateDroppedList} from "../nation/locations/Mining";
import {getCapital} from "../nation/Nation";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* RoleDistributor.ts | Script for distributor role logic
* */

export var roleDistributor = {
  /*
  * Distributor
  * Cost: 900 Energy
  *
  * Sends resources to storage to be used by Maintainers.
  * */
  run(creep: Creep) {
    if (!creep.memory.working) {
      if (creep.memory.target == null || Game.getObjectById(creep.memory.target as Id<any>) == null) {
        let sourcesId = generateDroppedList().filter((source) => !Creeps.isTargeted(source))
        let sources: any[] = [];
        sourcesId.forEach((src) => {
          sources.push(Game.getObjectById(src));
        })
        sources.concat(creep.room.find(FIND_TOMBSTONES).filter((source) => !Creeps.isTargeted(source.id) && source.store[RESOURCE_ENERGY] > 0));
        sources.concat(creep.room.find(FIND_RUINS).filter((source) => !Creeps.isTargeted(source.id) && source.store[RESOURCE_ENERGY] > 0));
        if (getCapital(creep.room)?.memory.mainLink != null && Game.getObjectById(getCapital(creep.room)?.memory.mainLink as Id<any>).store[RESOURCE_ENERGY] > 0) {
          sources.push(Game.getObjectById(getCapital(creep.room)?.memory.mainLink as Id<any>));
        }
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

      if (creep.memory.target != null) {
        let errorNotInRange = false;
        if (Game.getObjectById(creep.memory.target as Id<any>) instanceof Resource) {
          if (creep.pickup(Game.getObjectById(creep.memory.target as Id<any>)) == ERR_NOT_IN_RANGE) {
            errorNotInRange = true;
          }
        } else if (Game.getObjectById(creep.memory.target as Id<any>) instanceof Tombstone || Game.getObjectById(creep.memory.target as Id<any>) instanceof Ruin || Game.getObjectById(creep.memory.target as Id<any>) instanceof StructureLink) {
          if (creep.withdraw(Game.getObjectById(creep.memory.target as Id<any>), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              errorNotInRange = true;
          }
        }
        if (errorNotInRange) {
          Creeps.pathFind(creep, Game.getObjectById(creep.memory.target as Id<any>).pos, '#0016ff', 'solid');
        }
        if (Game.getObjectById(creep.memory.target as Id<any>) != null && "store" in Game.getObjectById(creep.memory.target as Id<any>) && Game.getObjectById(creep.memory.target as Id<any>).store[RESOURCE_ENERGY] == 0) {
          creep.memory.target = null;
        }
      } else if (creep.memory.target != null && Game.getObjectById(creep.memory.target) == null) {
        creep.memory.target = null;
      }

      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        creep.say("🧰 Dist");
        creep.memory.working = true;
        creep.memory.target = null;
      }

    } else {
      const capital = creep.room.find(FIND_MY_SPAWNS)[0];
      const roomController = creep.room.controller;

      if (creep.memory.target == null || Game.getObjectById(creep.memory.target as Id<any>) == null) {
        let storagesOrContainers = creep.room.find(FIND_MY_STRUCTURES, {
          filter: (str) => {
            return (str.structureType == STRUCTURE_STORAGE);
          }
        })
        if (storagesOrContainers.length == 0) {
          storagesOrContainers = Game.rooms[Object.keys(Game.rooms)[0]].find(FIND_MY_STRUCTURES, {
            filter: (str) => {
              return (str.structureType == STRUCTURE_STORAGE);
            }
          })
        }


        const nearestSource = creep.pos.findClosestByPath(storagesOrContainers);
        if (nearestSource != null) {
          creep.memory.target = nearestSource.id;
          creep.memory.idle = false;
        } else {
          if (storagesOrContainers.length > 0) {
            creep.memory.target = storagesOrContainers[0].id;
            creep.memory.idle = false;
          } else {
            creep.memory.idle = true;
          }
        }
      }
      if (creep.memory.target != null) {
        if (creep.transfer(Game.getObjectById(creep.memory.target as Id<any>), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          Creeps.pathFind(creep, Game.getObjectById(creep.memory.target as Id<any>).pos, '#0016ff', 'solid');

        } else if (creep.transfer(Game.getObjectById(creep.memory.target as Id<any>), RESOURCE_ENERGY) == ERR_INVALID_TARGET) {
          let storagesOrContainers = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (str) => {
              return (str.structureType == STRUCTURE_STORAGE) && str.store[RESOURCE_ENERGY] > 0;
            }
          })


          const nearestSource = creep.pos.findClosestByPath(storagesOrContainers);
          if (nearestSource != null) {
            creep.memory.target = nearestSource.id;
            creep.memory.idle = false;
          } else {
            if (storagesOrContainers.length > 0) {
              creep.memory.target = storagesOrContainers[0].id;
              creep.memory.idle = false;
            } else {
              creep.memory.idle = true;
            }
          }
        }
      }
      if (creep.store[RESOURCE_ENERGY] <= 0) {
        creep.say("🔨 Pickup");
        creep.memory.working = false;
        creep.memory.target = null;
      }
    }
  },
    bodyParts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
      name: 'Distributor',
      memoryName: 'distributor',
      amount: 2 * Object.keys(Game.rooms).length,
      autoSpawn: true,
  }



