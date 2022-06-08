/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* Spawn.ts | Script for spawn methods and logic.
* */

/*
* spawnCreep();
* Executes StructureSpawn.spawnCreep() based on the role, at the specified spawn location in the parameters.
* */
export const spawnCreep = function(spawn: StructureSpawn, role: { name: string, memoryName: string, amount: number, bodyParts: BodyPartConstant[], autoSpawn: boolean }) {

  if (spawn != null && spawn.memory.allowsSpawn) {

    spawn.spawnCreep(role.bodyParts, `${role.name}_${Math.round(Math.random() * 10000)}`, { memory: { role: role.memoryName, working: false, target: null, idle: false, attackId: null }, });

    spawn.room.visual.text(`🚀 Spawning ${role.name}`, spawn.pos.x, spawn.pos.y - 2.2, { stroke: "#00ffc3", font: "0.7 Times New Roman" });
  }
}

/*
* findAvailibleSpawn();
* Returns the spawn with the smallest queue to queue a role (roleString)
* */
export const findAvailableSpawn = function(roleString: string) {
  const spawns = Object.values(Game.spawns);
  spawns.sort(function(a, b) { return a.memory.queue.length-b.memory.queue.length; });
  const spawn = spawns[0];
  spawn.memory.queue.push(roleString);
  return spawn;
}
