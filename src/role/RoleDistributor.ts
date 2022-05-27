import {getAmount, isTargeted} from "./manager/Creeps";
import {getCapital} from "../nation/Nation";

import {generateDroppedList, generateSourceList} from "../nation/OutsourcedMining";
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
      let autoUpgrade = () => {
        if (capital != null) {
          return capital.memory.autoUpgradeController;
        } else {
          return false;
        }
      };
      /*
               * Priorities for Distributor Role
               * Controller if ticks are under 9000, or spawn auto upgrades controller.
               * Spawns/Extensions
               * Build
               * Controller
      */


      if (creep.memory.target == null || Game.getObjectById(creep.memory.target) == null) {
        let targets: any[] = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) && structure.my;
          }
        });

        if (targets.length == 0) {
          targets = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
        }
        if (creep.pos.findClosestByPath(targets) != null) {
          creep.memory.target = creep.pos.findClosestByPath(targets).id;
        }
        if (roomController != null) {
          if (creep.memory.target == null) {
            creep.memory.target = roomController.id;
          } else if (roomController.ticksToDowngrade < 9000 || (capital != null && capital.memory.autoUpgradeController)) {
            creep.memory.target = roomController.id;
          }
        }
      }
      if (creep.memory.target != null) {

        if (Game.getObjectById(creep.memory.target) instanceof ConstructionSite) {
          let site = Game.getObjectById(creep.memory.target);
          if (site != null) {
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
              creep.moveTo(site, {visualizePathStyle: {stroke: '#ff0000'}})
            }
            if (site.totalProgress <= 0) {
              creep.memory.target = null;
            }
          }
        } else if (Game.getObjectById(creep.memory.target) instanceof Structure) {
          let str = Game.getObjectById(creep.memory.target);
          if (str.structureType == STRUCTURE_CONTROLLER) {

            if (creep.upgradeController(str) == ERR_NOT_IN_RANGE) {

              creep.moveTo(str, {visualizePathStyle: {stroke: '#ff0000'}})
            } else if (creep.upgradeController(str) == OK) {

              if (str.sign == null) {

                creep.signController(str, "\"Science may never come up with a better office communication system than the coffee break.\" ~ Earl Wilson")
              }
            }
          } else if (str.structureType == STRUCTURE_SPAWN || str.structureType == STRUCTURE_EXTENSION || str.structureType == STRUCTURE_TOWER) {
            if (creep.transfer(str, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(str, {visualizePathStyle: {stroke: '#ff0000'}})
            }
            if (creep.transfer(str, RESOURCE_ENERGY) == ERR_FULL) {
              creep.memory.target = null;
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
    bodyParts: [MOVE, MOVE, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
      name: 'Distributor',
      memoryName: 'distributor',
      amount: getAmount("harvester"),
  }



