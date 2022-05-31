import {roleRecovery} from "../RoleRecovery";
import {roleHarvester} from "../RoleHarvester";
import {roleDistributor} from "../RoleDistributor";
import {roleMaintainer} from "../RoleMaintainer";

export const roles = function() {
  let rolesMap = new Map();
  rolesMap.set("recovery", roleRecovery);
  rolesMap.set("harvester", roleHarvester);
  rolesMap.set("distributor", roleDistributor);
  rolesMap.set("maintainer", roleMaintainer);
  return rolesMap;
}

