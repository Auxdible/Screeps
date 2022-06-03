import {roleRecovery} from "../RoleRecovery";
import {roleHarvester} from "../RoleHarvester";
import {roleDistributor} from "../RoleDistributor";
import {roleMaintainer} from "../RoleMaintainer";
import {attackerDPS} from "../attack/AttackerDPS";
import {attackerTank} from "../attack/AttackerTank";
import {attackerHealer} from "../attack/AttackerHealer";

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

