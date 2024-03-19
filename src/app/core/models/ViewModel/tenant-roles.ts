export class TenantRole {
    id: number = 0;
    nameAr: string = "";
    nameEn: string = "";
}

export class TenantRolesData {
    data: TenantRole[] = [{
        id: 0,
        nameAr: "مستأجر",
        nameEn: "Tenants"
    },
    {
        id: 1,
        nameAr: "بائع",
        nameEn: "Seller"
    },
    {
        id: 2,
        nameAr: "مشتري",
        nameEn: "Buyer"
    }
    ];
}