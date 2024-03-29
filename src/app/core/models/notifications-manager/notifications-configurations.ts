export interface NotificationsConfigurations {
  id: number;
  sentTime: string | null;
  repeatNumber: number | null;
  dayBetweenSent: number | null;
  email: string;
  emailPassword: string;
  dispalyName: string;
  hostName: string;
  portNumber: string;
  smsUrl: string;
  smsUserName: string;
  smsPassword: string;
  smsMessage: string;
  smsMobile: string;
  smsSender: string;
  smsUrlCredit: string;
  isEmail: boolean | null;
  isSms: boolean | null;
  isWhatsApp: boolean | null;
  isEndContract: boolean | null;
  numberDayEndContract: number | null;
  isPaymentDate: boolean | null;
  numberDayPaymentDate: number | null;
  isContractCreated: boolean | null;
  isReceiptVoucherCreated: boolean | null;
  isOwner: boolean | null;
  isTenant: boolean | null;
  whatsAppTwilioInstanceId: string;
  whatsAppAccountSid: string;
  whatsAppAuthToken: string;
  whatsAppTwilioToken: string;
  whatsAppProviderId: number | null;
}
