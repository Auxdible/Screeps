/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* Mining.ts | Script for miner logic
* */

/*
* generateSourceList();
* Generates a list of all Source objects.
* */
export const generateSourceList = function () {
  const sourceList: Id<any>[] = [];
  for (const name of Object.keys(Game.rooms)) {
    for (const source of Game.rooms[name].find(FIND_SOURCES)) {
      sourceList.push(source.id);
    }
  }
  return sourceList;
}

/*
* generateDroppedList();
* Generates a list of all DroppedResource objects.
* */
export const generateDroppedList = function () {
  const sourceList: Id<any>[] = [];
  for (const name of Object.keys(Game.rooms)) {
    for (const source of Game.rooms[name].find(FIND_DROPPED_RESOURCES)) {
      sourceList.push(source.id);
    }
  }
  return sourceList;
}

/*
* allSpotsList();
* Generates a list of a Source Id<any> for every empty slot.
* */
export const allSpotsList = function () {
  const sourceList: Id<any>[] = [];
  for (const name of Object.keys(Game.rooms)) {
    for (const source of Game.rooms[name].find(FIND_SOURCES)) {
      for (let i = 0; i < amountCanMine(source, false); i++) {
        sourceList.push(source.id);
      }
    }
  }
  return sourceList;
}

/*
* amountCanMine();
* Returns the amount of mineable areas nearby a source.
* */
export const amountCanMine = function(source: Source, scanCreeps: boolean) {
  let slots = 0;
  const locations = [source.room.lookAt(source.pos.x + 1, source.pos.y),
    source.room.lookAt(source.pos.x - 1, source.pos.y),
    source.room.lookAt(source.pos.x, source.pos.y + 1),
    source.room.lookAt(source.pos.x, source.pos.y - 1),
    source.room.lookAt(source.pos.x - 1, source.pos.y + 1),
    source.room.lookAt(source.pos.x + 1, source.pos.y - 1),
    source.room.lookAt(source.pos.x - 1, source.pos.y - 1),
    source.room.lookAt(source.pos.x + 1, source.pos.y + 1)];
  for (const location of locations) {
    let structureOn = false;
    for (const loc of location) {
      if (loc.hasOwnProperty('structure') && loc.structure?.structureType != STRUCTURE_ROAD && loc.structure?.structureType != STRUCTURE_RAMPART) {
        structureOn = true;
      }
      if (loc.hasOwnProperty('creep') && scanCreeps) {
        structureOn = true;
      }
    }
    if (location[0].terrain != "wall" && !structureOn) {
      slots++;
    }
  }
  return slots;
}
