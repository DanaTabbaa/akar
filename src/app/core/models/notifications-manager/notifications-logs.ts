export interface NotificationsManagementLogs {
  id: number;
  notificationId: number | null;
  eventId: number | null;
  type: number | null;
  recieverId: number | null;
  recieverType: number | null;
  descriptionEn: string;
  descriptionAr: string;
  sendDate: string | null;
  sendText: string;
  sendStatus: boolean | null;
}
export interface VwNotificationManagementLogs {
  notificationId: number | null;
  eventId: number | null;
  recieverNameAr: string;
  recieverNameEn: string;
  sender: string;
  recieverTypeAr: string;
  recieverTypeEn: string;
  subject: string;
  notificationTypeAr: string;
  notificationTypeEn: string;
  eventTypeAr: string;
  eventTypeEn: string;
  recieverMobileAr: string;
  recieverEmailAr: string;
  recieverMobileEn: string;
  recieverEmailEn: string;
  sendTextAr: string;
  sendTextEn: string;
  sentStatusAr: string;
  sentStatusEn: string;
}
