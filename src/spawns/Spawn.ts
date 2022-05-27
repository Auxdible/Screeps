import { roles } from "../role/manager/Roles";
import { getAmount } from "../role/manager/Creeps";

export const autoSpawn = function(role: { memoryName: string }) {
  // @ts-ignore
  if (getAmount(role.memoryName) >= role.amount) {
    return;
  }

  const spawn = findAvailableSpawn(role.memoryName)[0];

  if (spawn != null && spawn.memory.allowsSpawn) {
    // @ts-ignore
    spawn.spawnCreep(role.bodyParts, `${role.name}_${Math.round(Math.random() * 10000)}`, { memory: { role: role.memoryName, working: false, }, });
    // @ts-ignore
    spawn.room.visual.text(`🚀 Spawning ${role.name}`, new RoomPosition(spawn.pos.x + 2, spawn.pos.y + 2, spawn.room.name), { stroke: "#00ffc3", fontSize: 4 });
  }
}
export const spawnCreep = function(spawn: StructureSpawn, role: Object) {
  // @ts-ignore
  spawn.spawnCreep(role.bodyParts, `${role.name}_${Math.round(Math.random() * 10000)}`, { memory: { role: role.memoryName, working: false, }, });
  // @ts-ignore
  spawn.room.visual.text(`🚀 Spawning ${role.name}`, new RoomPosition(spawn.pos.x + 2, spawn.pos.y + 2, spawn.room.name), { stroke: "#00ffc3", fontSize: 4 });

}
export const findAvailableSpawn = function(roleString: string) {
  const spawns = [];
  for (const name of Object.keys(Game.spawns)) {
    const spawn = Game.spawns[name];

    const role = roles().get(roleString);

    if (role != null && spawn.spawnCreep(role.bodyParts, `${role.name}_${Math.round(Math.random() * 10000)}`, { dryRun: true }) == OK) {
      spawns.push(spawn);
    }
  }
  return spawns;
}
