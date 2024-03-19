export class Users {
  id!: number;
  userName!: string;
  email!: string;
  phoneNumber!: string;
  firstNameAr!: string;
  firstNameEn!: string;
  isActive!: boolean | null;
  isAdmin!: boolean | null;
  isSuperAdmin!: boolean | null;
  roleId!: number | null;
  defaultLanguage!: string;
}
