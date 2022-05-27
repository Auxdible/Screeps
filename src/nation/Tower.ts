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
        const hurtStructure = tower.pos.findClosestByRange(tower.room.find(FIND_MY_STRUCTURES, { filter: (str) => { return str.hits < str.hitsMax; } }));
        if (hurtStructure != null) {
          tower.repair(hurtStructure);
        }
      }
    }
  }

}
