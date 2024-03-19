import { UserPermission } from "./user-permissions";

export class EntryTypeUsersPermissions {
  id?: number;
  entryTypeId?: number ;
  userId?: number ;
  permissionsJson?:UserPermission;
}
