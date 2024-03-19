import { ContractSettingsUsersPermissions } from "../contract-settings-role-permissions";
import { ContractsSettings } from "../contracts-settings";

export class ContractsSettingsVm{
  contractsSettings!:ContractsSettings;
  contractSettingsUsersPermissions:ContractSettingsUsersPermissions[]=[];

}
