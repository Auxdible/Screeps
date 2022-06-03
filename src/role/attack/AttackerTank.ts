// IMPORTS
import {getAttack} from "../../main";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* AttackerTank.ts | Script for tank role logic
* */

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
        if (attack != null) {
          // Rendezvous
          if (!attack.started) {
            if (creep.pos == attack.rendezvous) {
              creep.move(RIGHT);
            } else {
              creep.say("Rendezvous");
              creep.moveByPath(PathFinder.search( creep.pos,{pos: attack.rendezvous, range: 1}).path);
            }
          } else if (attack.started) {
            if (Game.rooms[attack.roomId] == null) {
              creep.moveByPath(PathFinder.search(creep.pos, {pos: new RoomPosition(25, 25, attack.roomId), range: 1}).path);
            } else if (Game.rooms[attack.roomId] != null && creep.room.name != attack.roomId) {
              creep.moveByPath(PathFinder.search(creep.pos, {pos: new RoomPosition(25, 25, attack.roomId), range: 1}).path);
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
                  creep.moveTo((Game.getObjectById(creep.memory.target) as RoomObject).pos);
                }
              }
            }
          }
        }
      }
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


