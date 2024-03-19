import { Data } from "@angular/router";
import { Countries } from "./countries";

export class UserRegisterations {
    id!: number;
    nameAr!: string;
    nameEn!: string;
    userName!: string;
    email!: string;
    mobile!: string;
    countryId!: number | null;
    registerTypeId!: number | null;
    registerationDate!: Date | null;
    userTypeId!: number | null;
    commercialRegistrationNo!: string;
    commercialRegistrationIssueDate!: Date | null;
    unifiedNumber!: string;
    attachmentId!: number ;
    requestStatus!: number | null;
    country!: any|null;
    roleId!:number;
}
