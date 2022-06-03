/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* Tower.ts | Script for StructureTower logic
* */

export const tower = {
  run(tower: StructureTower) {
    /*
    * Tower Priorities
    * Attack baddies >:)
    * Heal hurt creeps
    * Repair stuff
    * */
    const enemyCreeps = tower.room.find(FIND_HOSTILE_CREEPS);
    if (enemyCreeps.length != 0) {

      tower.attack(tower.pos.findClosestByRange(enemyCreeps) as Creep);

    } else {
      const hurtCreeps = tower.room.find(FIND_MY_CREEPS, { filter: (creep) => { return creep.hits < creep.hitsMax; } });
      if (hurtCreeps.length != 0) {
        tower.heal(tower.pos.findClosestByRange(hurtCreeps) as Creep);

      } else {
        const hurtStructure = tower.pos.findClosestByRange(tower.room.find(FIND_STRUCTURES, { filter: (str) => {
          if ((str.structureType == STRUCTURE_RAMPART || str.structureType == STRUCTURE_WALL)) {
            return str.hits < 500000;
          } else {
            return str.hits < str.hitsMax;
          }

        } }));
        if (hurtStructure != null) {
          tower.repair(hurtStructure);
        }
      }
    }
  }

}
