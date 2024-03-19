import { Voucher } from "../../models/voucher"

export interface VoucherModel{
    list:Voucher[]
}

export interface SelectedVoucherModel{
    selected?:Voucher
}