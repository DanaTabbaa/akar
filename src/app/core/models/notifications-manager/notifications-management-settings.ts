import { Owner } from "../owners";
import { Tenants } from "../tenants";

export class NotificationsManagementSettings {
    id!: number;
    eventId!: number;
    period!: string;
    receiverCheckId!: number;
    ownersIds!: string;
    tenantsIds!: string;
    buildingsIds!: string;
    isWhatsApp!: boolean;
    isEmail!: boolean;
    isSms!: boolean;
    sender!: string;
    subject!: string;
    emailBody!: string;
    notifiactionBody!:string;
    


}
