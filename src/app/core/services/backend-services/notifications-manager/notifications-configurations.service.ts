import { Injectable } from '@angular/core';
import { NotificationsConfigurations } from 'src/app/core/models/notifications-manager/notifications-configurations';
import { AppConfigService } from '../../local-services/app-config.service';
import { HttpClient } from '@angular/common/http';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsConfigurationsService extends BaseService<NotificationsConfigurations> {
  private readonly baseUrl = AppConfigService.appCongif.url;

  constructor(http:HttpClient) {
    super(http);
    this.path="NotificationsConfigurations";
  }
}
