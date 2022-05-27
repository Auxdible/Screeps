import {map} from "lodash";
import {amountCanMine} from "../../nation/OutsourcedMining";


export const getAmount = function(memoryName: string) {
  let amount = 0;
  for (const name of Object.keys(Game.creeps)) {
    if (Game.creeps[name].memory.role == memoryName) {
      amount++;
    }
  }
  return amount;
}
export const isTargeted = function(target: Id<any>) {
  const targets = new Map();
  const notSelectable: any[] = []
  for (const name of Object.keys(Game.creeps)) {
      let creep = Game.creeps[name];

      if (creep.memory.target != null && creep.memory.target == target) {
        if (targets.get(creep.memory.target) == null) {
          targets.set(creep.memory.target, 0);
        } else { targets.set(creep.memory.target, targets.get(creep.memory.target) + 1); }
        if (targets.get(creep.memory.target) >= amountCanMine(Game.getObjectById(target))) {
          notSelectable.push(creep.memory.target);
        }
        if (notSelectable.includes(target)) {
          return true;
        }
      }
    }
    return false;
}
