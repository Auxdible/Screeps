class Territories {
  public rooms: string[] = []
  public observers = new Map();
  constructor(dominionatedTerritories: string[]) {
    for (const str of dominionatedTerritories) {
      if (new RoomPosition(0, 0, str) != null) {
        this.rooms.push(str);
      } else { throw `Can't find room ${str}!`; }
    }
  }
  public addRoom(roomId: string) {
    if (new RoomPosition(0, 0, roomId) != null) {
      this.rooms.push(roomId);
    } else { throw `Can't find room ${roomId}!`; }
  }
  public getObserver(room: Room) {
    if (Game.rooms[room.name] == null) {
      return null;
    } else {
      let observers = room.find(FIND_MY_CREEPS, { filter: (creep) => { return creep.memory.role == 'observer'; } });
      if (observers.length > 0) {
        return observers[0];
      } else {
        return null;
      }
    }

  }
}
