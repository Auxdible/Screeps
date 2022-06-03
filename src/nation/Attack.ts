
import {findAvailableSpawn} from "../spawns/Spawn";
import {getRoles} from "../main";

export class Attack {
  public roomId;
  public squadronType;
  public squadron: Creep[];
  public attackId;
  public rendezvous;
  public started;
  constructor(roomId: string, squadron: string[], rendezvous: RoomPosition, exists: boolean, attackId: number, started: boolean) {
      this.rendezvous = rendezvous;
      this.squadron = [];
      this.started = false;
      this.roomId = roomId;
      this.squadronType = squadron;
      if (!exists) {
        this.attackId = Math.round(Math.random() * 10000);
        for (let string of this.squadronType) {
          if (getRoles.get(string) != null) {
            findAvailableSpawn(string);
          }
        }
        Memory.attacks.push(this);
      } else {
        this.attackId = attackId;
      }


  }
  initiateAttack() {
    for (var attack of Memory.attacks) {
      if (attack.attackId == this.attackId) {
        attack.started = true;
      }
    }
    this.started = true;

  }
  hasTank(): Creep | null {
    for (const creep of this.squadron) {
      if (creep != null && creep.memory.role == "tank") {
        return creep;
      }
    }
    return null;
  }


}

