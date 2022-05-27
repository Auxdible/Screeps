import {roleRecovery} from "../RoleRecovery";
import {roleHarvester} from "../RoleHarvester";
import {roleDistributor} from "../RoleDistributor";

export const roles = function() {
  let rolesMap = new Map();
  rolesMap.set("recovery", roleRecovery);
  rolesMap.set("harvester", roleHarvester);
  rolesMap.set("distributor", roleDistributor);
  return rolesMap;
}

