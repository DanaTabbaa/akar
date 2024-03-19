export class ProductsReceiptDetails {
id:any;
maintenanceRequestId:any;
productReceiptId:any;
productCategoryId:any;
categoryNameEn:string | undefined;
categoryNameAr:string | undefined;
productId:any;
productNameAr!:string;
productNameEn!:string;
quantity!:number;
price!:number;
valueBeforeTax!:number;
valueWithInstallationPriceBeforeTax!:number;
installationPrice!:number;
taxRatio!:number;
taxValue!:number;
valueAfterTax!:number;
unitId:any;
unitNameAr!:string;
unitNameEn!:string;
equipmentId:any;
equimentNameAr!:string;
equipmentNameEn!:string;
billed!:boolean;
maintenanceBillId:any;
}