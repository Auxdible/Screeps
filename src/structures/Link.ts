// IMPORTS
import {getCapital} from "../nation/Nation";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* Link.ts | Script for StructureLink logic
* */



export const link = {
  run(link: StructureLink) {
    const capitalLink = getCapital(link.room)?.memory.mainLink;
    if (capitalLink != null && link.store[RESOURCE_ENERGY] > 0 && capitalLink != link.id) {
      link.transferEnergy(Game.getObjectById(capitalLink) as StructureLink);
    }
  }

}
