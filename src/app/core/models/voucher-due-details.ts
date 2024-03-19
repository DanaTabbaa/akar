export class VoucherDueDetails {
    id!: number;
    parentId!: number;
    dueId!: number;
    //contractKindId!: number;
    amount!: number;
    notes!: string;
    debitNoteVoucherAmount:number = 0;
    creditNoteVoucherAmount:number = 0;
    recieveVoucherAmount:number=0; 
    payVoucherAmount:number = 0
    settlementAmount:number = 0;
    settlementDiscount:number = 0;
}


export class VoucherRentDueDetailsVm {
    id!: number;
    rentContractId!: number;
    dueName!: string;
    unitId!: number;
    typeId!: number;
    dueAmount: number = 0;
    dueStartDate!: any;
    dueEndDate!: any;
    notes!: string;
    serviceId!: number;
    isEntryGenerated!: boolean;
    isInvoiced!: boolean;
    paid: number = 0;
    settlementAmount: number = 0;
    settlementDiscount: number = 0;
    recieveVoucherAmount: number = 0;
    payVoucherAmount: number = 0;
    debitNoteVoucherAmount: number = 0;
    creditNoteVoucherAmount: number = 0;
    kindId!: string;
    tenantId!: string;
    ownerId!: string;
    officeId!: string;
    rentContractSettingId!: string;
    unitNameAr!: string;
    unitNameEn!: string;
    unitServiceArName!: string;
    unitServiceEnName!: string;
    tenantNameAr!: string;
    tenantNameEn!: string;
    tenantCode!: string;
    ownerNameAr!: string;
    ownerNameEn!: string;
    ownerCode!: string;
    amount:number = 0;
    contractArName!:string;
    contractEnName!:string;
    contractCode!:string;
    dueNameAr!:string;
    dueNameEn!:string;
    dueId!:number;
}