import { NotificationsManagementSettings } from "../../notifications-manager/notifications-management-settings";
import { Owner } from "../../owners";
import { Tenants } from "../../tenants";

export class NotificationsManagementViewModel{
  notificationsSetting!:NotificationsManagementSettings ;
  ownersSelectedList!:Owner[];
  tenantsSelectedList!:Tenants[];

}
