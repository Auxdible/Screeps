// IMPORTS

import {Creeps} from "../role/manager/Creeps";
import {getRoles} from "../main";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* Nation.ts | Script for worldwide methods and logic.
* */

/*
* printEconomyStatus();
* Prints the getEconomy(); method in readable format.
* */
export var printEconomyStatus = function() {
  const totalEnergy = getEconomy();
  //console.log(JSON.stringify(totalEnergy));
  console.log(`----------ECONOMY STATUS (Game Tick: ${Game.time})-----------`);
  if (totalEnergy.status == 1) {
    console.log("Status: EMERGENCY! (Status Code: 1)");
  } else if (totalEnergy.status == 0) {
    console.log("Status: Stable (Status Code: 0)");
  }
  console.log(`Total Energy: ${totalEnergy.totalEnergy} `);
  console.log(`Can Spawn: ${totalEnergy.couldSpawn} `);
  console.log("------Rooms------");
  for (const spawn of totalEnergy.spawns) {
      const {energy, canSpawn, id, spawnableEnergy, maxSpawnableEnergy} = spawn;
      console.log(`- Room ${id} - `);

      console.log(`Total Room Energy: ${energy}`);

      console.log(`Can Spawn: ${canSpawn}`);

      console.log(`Spawnable Energy: ${spawnableEnergy}/${maxSpawnableEnergy}`);

  }
}
/*
* getEconomy();
* Will return a response object containing information about the economy.
*
* 0 = OK
* 1 = EMERGENCY
* */
export var getEconomy = function() {
  let totalEnergy = 0;
  const spawns: any[] = []

  const response = {
    status: 0,
    totalEnergy: totalEnergy,
    couldSpawn: false,
    spawns: spawns,
  };
  for (const room of Object.keys(Game.rooms)) {
    const roomObject = Game.rooms[room];
    let roomEnergy = 0;
    roomObject.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_CONTAINER || str.structureType == STRUCTURE_SPAWN || str.structureType == STRUCTURE_STORAGE || str.structureType == STRUCTURE_EXTENSION})
      .forEach((src) => {
        if ("store" in src) {
          roomEnergy += src.store[RESOURCE_ENERGY];
        }});
    totalEnergy += roomEnergy;
    let spawnableEnergy = 0;
    let maxSpawnableEnergy = 0;
    roomObject.find(FIND_STRUCTURES, {filter: (str) => str.structureType == STRUCTURE_SPAWN || str.structureType == STRUCTURE_EXTENSION})
      .forEach((src) => {

        if ("store" in src) {
          let store = src.store.getCapacity(RESOURCE_ENERGY);

          maxSpawnableEnergy += src.store.getCapacity(RESOURCE_ENERGY);
          spawnableEnergy += src.store[RESOURCE_ENERGY];
        }});

    let canSpawn = false;
    roomObject.find(FIND_MY_SPAWNS).forEach((spawn) => { if (!canSpawn) {canSpawn = spawn.spawnCreep(getRoles.get("harvester").bodyParts, "spawnTest_" + (Math.random() * 10000), {dryRun: true}) == OK; } } );
    if (canSpawn) {
      roomObject.find(FIND_MY_SPAWNS).forEach((spawn) => { if (!canSpawn) {canSpawn = spawn.spawnCreep(getRoles.get("distributor").bodyParts, "spawnTest_" + (Math.random() * 10000), {dryRun: true}) == OK; } } );
    }
    if (canSpawn) {
      roomObject.find(FIND_MY_SPAWNS).forEach((spawn) => { if (!canSpawn) {canSpawn = spawn.spawnCreep(getRoles.get("maintainer").bodyParts, "spawnTest_" + (Math.random() * 10000), {dryRun: true}) == OK; } } );
    }
    const roomObj2 = {
      id: room,
      energy: roomEnergy,
      canSpawn: canSpawn,
      spawnableEnergy: spawnableEnergy,
      maxSpawnableEnergy: maxSpawnableEnergy,
    };

    response.spawns.push(roomObj2);
    if (canSpawn) {
      response.couldSpawn = true;
    }
  }

  if (!response.couldSpawn && (Creeps.getAmountNoQueue("harvester") == 0 || Creeps.getAmountNoQueue("distributor") == 0 || Creeps.getAmountNoQueue("maintainer") == 0)) {
    response.status = 1;

  }
  return response;
}

/*
* getCapital();
* Returns the first spawn with the capital flag.
* */
export const getCapital = function(room: Room) {
  for (const spawn of room.find(FIND_MY_SPAWNS)) {
    if (spawn.memory.capital) {
      return spawn;
    }
  }
  return null;
}
