// IMPORTS
import {Creeps} from "./manager/Creeps";
import {generateConstructionSites, generateStorageList} from "../nation/locations/Mining";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* RoleMaintainer.ts | Script for maintainer role logic
* */

export var roleMaintainer = {
  /*
  * Maintainer
  * Cost: 900 Energy
  *
  * Maintain Structures
  * */
  run(creep: Creep) {
    if (!creep.memory.working) {
      if (creep.memory.target == null || Game.getObjectById(creep.memory.target as Id<any>) == null || (creep.memory.target != null && creep.withdraw(Game.getObjectById(creep.memory.target as Id<any>), RESOURCE_ENERGY) == ERR_INVALID_TARGET)) {
        let storagesOrContainers: StructureStorage[] = generateStorageList();


        const nearestSource = creep.pos.findClosestByRange(storagesOrContainers);
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


      if (creep.memory.target != null && creep.withdraw(Game.getObjectById(creep.memory.target as Id<any>), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        Creeps.pathFind(creep, Game.getObjectById(creep.memory.target as Id<any>).pos, '#0016ff', 'solid');
      }
      if (creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
        creep.say("💧 Main");
        creep.memory.working = true;
        creep.memory.target = null;
      }
    } else {
      /*
               * Priorities for Maintainer Role
               * Controller if ticks are under 9000, or spawn auto upgrades controller.
               * Spawns/Extensions
               * Build
               * Controller
      */
      const capital = creep.room.find(FIND_MY_SPAWNS)[0];

      let autoUpgrade = () => {
        if (capital != null) {
          return capital.memory.autoUpgradeController;
        } else {
          return false;
        }
      };
        if (creep.memory.target == null || Game.getObjectById(creep.memory.target as Id<any>) == null) {
          let targets: any[] = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return ((structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) &&
                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0) && structure.my && !Creeps.isTargeted(structure.id);
            }
          });
            if (targets.length == 0) {
              targets = generateConstructionSites();
              console.log(targets);
              targets.sort((tar, tar2) => { return tar.progress-tar2.progress; })
            }


            if (targets.length > 0) {
              creep.memory.target = targets[0];
            }

            let controllers: StructureController[] = [];
            Object.keys(Game.rooms).forEach((str) => {
              controllers.push(Game.rooms[str].controller as StructureController);
            });
            for (let controller of controllers) {
              if ("ticksToDowngrade" in controller && controller.ticksToDowngrade < 9000) {
                creep.memory.target = controller.id;
              }
            }
            controllers.sort((a, b) => {
              return a.progressTotal - b.progressTotal;
            })
            if (targets.length == 0 && creep.memory.target == null) {
              let lowestController = controllers[0];
              creep.memory.target = lowestController.id;
            }

        }


        if (creep.memory.target != null) {

          if (Game.getObjectById(creep.memory.target as Id<any>) instanceof ConstructionSite) {
            let site = Game.getObjectById(creep.memory.target as Id<any>) as ConstructionSite;
            if (site != null) {
              if (creep.build(site) != OK) {
                Creeps.pathFind(creep, site.pos, '#ff0000', 'dashed');
              }
              if (Game.getObjectById(creep.memory.target as Id<any>) == null) {
                creep.memory.target = null;
              }
            }
          } else if (Game.getObjectById(creep.memory.target as Id<any>) instanceof Structure) {
            let str = Game.getObjectById(creep.memory.target as Id<any>);
            if (str.structureType == STRUCTURE_CONTROLLER) {

              if (creep.upgradeController(str) == ERR_NOT_IN_RANGE) {

                Creeps.pathFind(creep, str.pos, '#ff0000', 'dashed');
              } else if (creep.upgradeController(str) == OK) {
                Creeps.pathFind(creep, str.pos, '#ff0000', 'dashed');
                if (str.sign == null) {
                  creep.signController(str, "\"Science may never come up with a better office communication system than the coffee break.\" ~ Earl Wilson")
                }
              }
            } else if (str.structureType == STRUCTURE_SPAWN || str.structureType == STRUCTURE_EXTENSION || str.structureType == STRUCTURE_TOWER) {
              if (creep.transfer(str, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                Creeps.pathFind(creep, str.pos, '#ff0000', 'dashed');
              }
              if (creep.transfer(str, RESOURCE_ENERGY) == ERR_FULL) {
                creep.memory.target = null;
              }
            }
          }
          if (creep.store[RESOURCE_ENERGY] <= 0) {
            creep.say("🔨 Pickup");
            creep.memory.working = false;
            creep.memory.target = null;
          }
        }
    }
  },
    bodyParts: [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
      name: 'Maintainer',
      memoryName: 'maintainer',
      amount: 4 * Object.keys(Game.rooms).length,
      autoSpawn: true,
  }



