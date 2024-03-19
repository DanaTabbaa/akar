import { ContractSettingsRolePermissions } from "../contract-settings-role-permissions";
import { EntryTypeRolesPermissions } from "../entry-type-roles-permissions";
import { RolesPermissions } from "./roles-permissions";

export class Roles {
  id?: any;
  roleNameAr?: string;
  roleNameEn?: string;
  remark?: string;
  isActive?: boolean | null;
  checkAllPermissions?: boolean | null;
  rolesPermissions:RolesPermissions[]=[];
  contractSettingsRolesPermissions:ContractSettingsRolePermissions[]=[]
  entryTypeRolesPermissions:EntryTypeRolesPermissions[]=[];
}
