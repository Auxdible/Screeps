import {getAmount, isTargeted} from "./manager/Creeps";
import {getCapital} from "../nation/Nation";

import {generateDroppedList, generateSourceList} from "../nation/Mining";
import {roleHarvester} from "./RoleHarvester";

export var roleDistributor = {
  /*
  * Distributor
  * Cost: 700 Energy
  *
  * Spawns when status = 1 or emergency to recover energy levels. Budget unit.
  * */
  run(creep: Creep) {
    if (!creep.memory.working) {
      if (creep.memory.target == null || Game.getObjectById(creep.memory.target) == null) {
        let sourcesId = generateDroppedList().filter((source) => !isTargeted(source));
        let sources: any[] = [];
        sourcesId.forEach((src) => {
          sources.push(Game.getObjectById(src));
        })
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


      if (creep.memory.target != null && creep.pickup(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {

        creep.moveTo(Game.getObjectById(creep.memory.target), {
          visualizePathStyle: {
            stroke: '#0016ff',
            lineStyle: 'solid'
          }
        });
      } else if (creep.memory.target != null && creep.pickup(Game.getObjectById(creep.memory.target)) == ERR_INVALID_TARGET) {
        let sourcesId = generateDroppedList().filter((source) => !isTargeted(source));
        let sources: any[] = [];
        sourcesId.forEach((src) => {
          sources.push(Game.getObjectById(src));
        })
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

      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        creep.say("🧰 Dist");
        creep.memory.working = true;
        creep.memory.target = null;
      }

    } else {
      const capital = creep.room.find(FIND_MY_SPAWNS)[0];
      const roomController = creep.room.controller;

      /*
               * Priorities for Distributor Role
               * Storage
      */


      if (creep.memory.target == null || Game.getObjectById(creep.memory.target) == null) {
        let storagesOrContainers = creep.room.find(FIND_MY_STRUCTURES, {
          filter: (str) => {
            return (str.structureType == STRUCTURE_STORAGE);
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
      if (creep.memory.target != null) {
        if (creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {

          creep.moveTo(Game.getObjectById(creep.memory.target), {
            visualizePathStyle: {
              stroke: '#0016ff',
              lineStyle: 'solid'
            }
          });
        } else if (creep.transfer(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_INVALID_TARGET) {
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
      amount: 2,
  }



