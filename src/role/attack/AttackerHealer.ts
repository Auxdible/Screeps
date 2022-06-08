// IMPORTS

// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* AttackerHealer.ts | Script for healer role logic
* */

import {getAttack} from "../../nation/Attack";
import {Creeps} from "../manager/Creeps";

export var attackerHealer = {
  /*
  * Healer Role
  * Cost: 1800 Energy
  *
  * Expensive healing unit that will heal damaged creeps.
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
                Creeps.pathFind(creep, new RoomPosition(24, 24, attack.rendezvous.roomName), '#aa404f', 'dotted');
              }
            } else if (attackObj.started) {
              if (Game.rooms[attack.roomId] == null) {
                if (attack.hasTank() == null) {
                  Creeps.pathFind(creep, new RoomPosition(24, 24, attack.roomId), '#aa404f', 'dotted');
                }
              } else if (Game.rooms[attack.roomId] != null && creep.room.name != attack.roomId) {
                creep.say("Attack");
                Creeps.pathFind(creep, new RoomPosition(24, 24, attack.roomId), '#aa404f', 'dotted');
              } else if (Game.rooms[attack.roomId] != null && creep.room.name == attack.roomId) {
                let target = creep.room.find(FIND_MY_CREEPS, {
                  filter: (creepDamaged) => {
                    return creepDamaged.hits < creepDamaged.hitsMax;
                  }
                })
                if (target.length > 0) {
                  if (creep.heal(creep.pos.findClosestByPath(target) as Creep) == ERR_NOT_IN_RANGE) {
                    Creeps.pathFind(creep, creep.pos.findClosestByPath(target)?.pos as RoomPosition, '#aa404f', 'solid');
                  }
                }
              }
            }
          }
        } else { creep.memory.attackId = null; }
      }
    }

  },
  bodyParts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
  name: 'Healer',
  memoryName: 'healer',
  amount: 0,
  autoSpawn: false,
}


