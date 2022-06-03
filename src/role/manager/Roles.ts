// IMPORTS
import {roleRecovery} from "../RoleRecovery";
import {roleHarvester} from "../RoleHarvester";
import {roleDistributor} from "../RoleDistributor";
import {roleMaintainer} from "../RoleMaintainer";
import {attackerDPS} from "../attack/AttackerDPS";
import {attackerTank} from "../attack/AttackerTank";
import {attackerHealer} from "../attack/AttackerHealer";
// IMPORTS

/*
* Auxdible's Screeps Code
* Written by Auxdible
*
* Roles.ts | Contains an export with a map of each role with the memoryName as its key.
* */

/*
* roles();
* Returns a role map containing each role with the memoryName as its key.
* */
export const roles = function() {
  let rolesMap = new Map();
  rolesMap.set("recovery", roleRecovery);
  rolesMap.set("harvester", roleHarvester);
  rolesMap.set("distributor", roleDistributor);
  rolesMap.set("maintainer", roleMaintainer);
  rolesMap.set("dps", attackerDPS);
  rolesMap.set("tank", attackerTank);
  rolesMap.set("healer", attackerHealer);

  return rolesMap;
}

