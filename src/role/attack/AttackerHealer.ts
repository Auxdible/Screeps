import {Attack} from "../../nation/Attack";
import {findAttackTarget} from "../manager/Creeps";
import {getAttack} from "../../main";

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
              let target = creep.room.find(FIND_MY_CREEPS, {filter: (creepDamaged) => { return creepDamaged.hits < creepDamaged.hitsMax; }})
              if (target.length > 0) {
                if (creep.heal(creep.pos.findClosestByPath(target) as Creep) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(creep.pos.findClosestByPath(target) as Creep);
                }
              }
            }
          }
        }
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


