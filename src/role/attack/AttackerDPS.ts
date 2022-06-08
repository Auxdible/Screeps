// IMPORTS
import {Creeps} from "../manager/Creeps";
import {getAttack} from "../../nation/Attack";


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
                  Creeps.pathFind(creep, new RoomPosition(24, 24, attack.roomId), '#aa404f', 'dotted');
                } else if (Game.rooms[attack.roomId] != null && creep.room.name == attack.roomId) {
                  let target = Creeps.findAttackTarget(creep);
                  if (target != null) {
                    creep.say("Found!");
                    if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                      creep.moveTo(target);
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
  bodyParts: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
    ATTACK, ATTACK, ATTACK, ATTACK],
  name: 'DPS',
  memoryName: 'dps',
  amount: 0,
  autoSpawn: false,
}



