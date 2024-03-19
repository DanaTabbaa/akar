import { ContractSettingsRolePermissions } from "../../contract-settings-role-permissions";
import { ContractsSettings } from "../../contracts-settings";
import { PagePermission } from "../../pages-permissions/page-permissions";
import { Roles } from "../../permissions/roles";

export class RoleViewModel
{
  roles!:Roles;
  pages:any[]=[];
  contractPermissions:ContractSettingsRolePermissions[]=[]
}
