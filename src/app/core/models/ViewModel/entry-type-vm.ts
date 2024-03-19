import { EntryType } from "../entry-type";
import { EntryTypeRolesPermissions } from "../entry-type-roles-permissions";

export class EntryTypeVm{
  entryType!:EntryType;
  entryTypeUsersPermissions:EntryTypeRolesPermissions[]=[];

}
