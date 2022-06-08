/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* AttackerTank.ts | Script for tank role logic
* */


import {getAttack} from "../../nation/Attack";
import {Creeps} from "../manager/Creeps";

export var attackerTank = {
  /*
  * Tank Role
  * Cost: 1500 Energy
  *
  * Expensive unit to tank damage
  * */
  run(creep: Creep) {
    if (creep.memory.attackId == null || (getAttack(creep.memory.attackId) == null && creep.memory.attackId != null)) {
      if (Memory.attacks.length > 0) {
        creep.memory.attackId = Memory.attacks[0].attackId;
        Memory.attacks[0].squadron.push(creep);
      } else {
        // Recycle :)
        if (Game.spawns['Spawn1'].recycleCreep(creep) == ERR_NOT_IN_RANGE) {
          creep.moveTo(Game.spawns['Spawn1']);
        }
      }
    } else {
      if (getAttack(creep.memory.attackId) != null) {
        let attack = getAttack(creep.memory.attackId);
        let attackObj = null;

        if (attack != null) {
          for (let attacks of Memory.attacks) {
            if (attack.attackId == attacks.attackId) {
              attackObj = attacks;
            }
          }
          if (attackObj != null) {

            // Rendezvous
            if (!attackObj.started) {
              if (creep.pos.roomName == attack.rendezvous.roomName) {
                creep.say("Rendezvous");
                creep.moveTo(24, 24);
              } else {
                creep.say("Rendezvous");
                Creeps.pathFind(creep, new RoomPosition(24, 24, attack.rendezvous.roomName), '#aa404f', 'solid');
              }
            } else if (attackObj.started) {
              if (Game.rooms[attack.roomId] == null) {
                if (attack.hasTank() == null) {
                  Creeps.pathFind(creep, new RoomPosition(24, 24, attack.roomId), '#aa404f', 'dotted');
                }
              } else if (Game.rooms[attack.roomId] != null && creep.room.name != attack.roomId) {
                let route = Game.map.findRoute(creep.pos.roomName, attack.roomId);
                if (route != ERR_NO_PATH) {
                  Creeps.pathFind(creep, new RoomPosition(24, 24, attack.roomId), '#aa404f', 'dotted');
                }
            } else if (Game.rooms[attack.roomId] != null && creep.room.name == attack.roomId) {
                let target = creep.room.find(FIND_MY_CREEPS, {
                  filter: (creepDps) => {
                    return creepDps.memory.role == 'dps' && creepDps.memory.target != null;
                  }
                })
                if (target.length > 0) {
                  creep.memory.target = target[0].memory.target;
                  creep.say("Found!");
                  if (creep.memory.target != null) {
                    Creeps.pathFind(creep, (Game.getObjectById(creep.memory.target as Id<any>) as RoomObject).pos, '#ff0000', 'dashed');
                  }
                } else {
                  Memory.attacks.splice(Memory.attacks.indexOf(attackObj), 1);
                }
              }
            }
          }
        }
      } else { creep.memory.attackId = null; }
    }
  },
  bodyParts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
  TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
    TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
    TOUGH, TOUGH],

  name: 'Tank',
  memoryName: 'tank',
  amount: 0,
  autoSpawn: false,
}


