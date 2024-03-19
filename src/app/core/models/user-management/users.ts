export interface Users {
  id: number;
  userName: string;
  email: string;
  firstNameAr: string;
  middleNameAr: string;
  lastNameAr: string;
  firstNameEn: string;
  middleNameEn: string;
  lastNameEn: string;
  userType: number | null;
  isActive: boolean | null;
  isAdmin: boolean | null;
  isSuperAdmin: boolean | null;

}
