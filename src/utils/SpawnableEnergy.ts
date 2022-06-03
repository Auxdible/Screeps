import {spawnNames} from "../nation/Names";

export const getSpawnableEnergy = function (room: Room) {
    let spawnableEnergy = 0;
    room.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_SPAWN || str.structureType == STRUCTURE_EXTENSION})
      .forEach((src) => {
        if ("store" in src) {
          let store = src.store.getCapacity(RESOURCE_ENERGY);
          spawnableEnergy += src.store[RESOURCE_ENERGY];
        }});
    return spawnableEnergy;
  }

