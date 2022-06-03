// IMPORTS
import {isTargeted} from "./manager/Creeps";
import {getEconomy} from "../nation/Nation";
import {generateSourceList} from "../nation/locations/Mining";
import {roleHarvester} from "./RoleHarvester";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* RoleRecovery.ts | Script for recovery role logic
* */

export var roleRecovery = {
  /*
  * Recovery Role
  * Cost: 300 Energy
  *
  * Spawns when status = 1 or emergency to recover energy levels. Budget unit.
  * */
  run(creep: Creep) {
    if (getEconomy().status == 0) {
      roleHarvester.run(creep);
    } else {
    if (!creep.memory.working) {
      if (creep.memory.target == null) {
        let sourcesId = generateSourceList().filter((source) => !isTargeted(source));
        let sources: any[] = [];
        sourcesId.forEach((src) => { sources.push(Game.getObjectById(src)); })
        const nearestSource = creep.pos.findClosestByPath(sources);
        if (nearestSource != null) {
          creep.memory.target = nearestSource.id;
          creep.memory.idle = false;
        } else {
          creep.memory.idle = true;
        }
      }


      if (creep.memory.target != null && creep.harvest(Game.getObjectById(creep.memory.target)) != ERR_INVALID_TARGET && creep.harvest(Game.getObjectById(creep.memory.target)) == ERR_NOT_IN_RANGE) {

        creep.moveTo(Game.getObjectById(creep.memory.target), {
          visualizePathStyle: {
            stroke: '#0eff00',
            lineStyle: 'solid'
          }
        });
      }

      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        creep.say("➕ Recovery");
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
               * Priorities for Recovery Role
               * Controller if ticks are under 9000, or spawn auto upgrades controller.
               * Spawns/Extensions
               * Build
               * Controller
      */


      if (creep.memory.target == null) {
        let targets: any[] = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION) &&
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
          if (roomController != null && str.id == roomController.id) {
            if (creep.upgradeController(roomController) == ERR_NOT_IN_RANGE) {
              creep.moveTo(roomController, {visualizePathStyle: {stroke: '#ff0000'}})
            } else if (creep.upgradeController(roomController) == OK) {
              if (roomController.sign == null) {
                creep.signController(roomController, "\"Science may never come up with a better office communication system than the coffee break.\" ~ Earl Wilson")
              }
            }
          } else if (str.structureType == STRUCTURE_SPAWN || str.structureType == STRUCTURE_EXTENSION) {
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
        creep.say("🔨 Harvesting");
        creep.memory.working = false;
        creep.memory.target = null;
      }
    }
    }
  },
  bodyParts: [MOVE, CARRY, WORK, WORK],
  name: 'Recovery',
  memoryName: 'recovery',
  amount: 3,
  autoSpawn: false,
}


