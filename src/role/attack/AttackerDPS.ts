// IMPORTS
import {findAttackTarget} from "../manager/Creeps";
import {getAttack} from "../../main";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* AttackerDPS.ts | Script for dps role logic
* */

export var attackerDPS = {
  /*
  * DPS Role
  * Cost: 1790 Energy
  *
  * Expensive damage unit for battles. Spawns when an Attack is made.
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
                if (attack.hasTank() == null) {
                  creep.moveByPath(PathFinder.search(creep.pos, {pos: new RoomPosition(25, 25, attack.roomId), range: 1}).path);
                }
              } else if (Game.rooms[attack.roomId] != null && creep.room.name != attack.roomId) {
                creep.moveByPath(PathFinder.search(creep.pos, {pos: new RoomPosition(25, 25, attack.roomId), range: 1}).path);
              } else if (Game.rooms[attack.roomId] != null && creep.room.name == attack.roomId) {
                let target = findAttackTarget(creep);
                if (target != null) {
                  creep.say("Found!");
                  if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                  }
                }
              }
            }
          }
        }
      }
  },
  bodyParts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
    ATTACK, ATTACK, ATTACK, ATTACK],
  name: 'DPS',
  memoryName: 'dps',
  amount: 0,
  autoSpawn: false,
}



