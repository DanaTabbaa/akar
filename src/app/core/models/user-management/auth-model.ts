import { RolesPermissionsVm } from "../ViewModel/permissions/roles-permissions-vm";
import { Roles } from "../permissions/roles";

export interface AuthModel {
  message: string;
  isAuthenticated: boolean;
  isActive: boolean;
  userName: string;
  userId: string;
  email: string;
  role: Roles;
  token: string;
  rolesPermissions:RolesPermissionsVm[];
}
