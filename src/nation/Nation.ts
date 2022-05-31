/*
ResponseStatus Return Flags
0 = No Emergency
1 = Emergency
2 = Recovering
* */

export const miningTerritories = ['W28N6', 'W29N6', 'W28N5'];
export var printEconomyStatus = function() {
  const totalEnergy = getEconomy();

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
* 0 = OK
* 1 = EMERGENCY */
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

          maxSpawnableEnergy += store as number;
          spawnableEnergy += src.store[RESOURCE_ENERGY];
        }});

    let canSpawn = false;
    roomObject.find(FIND_MY_SPAWNS).forEach((spawn) => { if (!canSpawn) {canSpawn = spawn.spawnCreep([WORK, WORK, WORK], "spawnTest_" + (Math.random() * 10000), {dryRun: true}) == OK; } } );
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
  if (!response.couldSpawn && (getHarvesterCreeps().length == 0 || getDistributorCreeps().length == 0)) {
    response.status = 1;

  }
  return response;
}
export var getHarvesterCreeps = function() {
  const workers = [];
  for (const creep of Object.keys(Game.creeps)) {
    if (Game.creeps[creep].memory.role == "harvester") {
        workers.push(Game.creeps[creep]);
    }
  }
  return workers;
}
export var getDistributorCreeps = function() {
  const haulers = [];
  for (const creep of Object.keys(Game.creeps)) {
    if (Game.creeps[creep].memory.role == "distributor") {
      haulers.push(Game.creeps[creep]);
    }
  }
  return haulers;
}

export const getCapital = function() {
  for (const spawn of Object.keys(Game.spawns)) {
    if (Game.spawns[spawn].memory.capital) {
      return Game.spawns[spawn];
    }
  }
  return null;
}
