import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { AppConfigService } from '../local-services/app-config.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportFile } from '../../models/report-file';

@Injectable({
  providedIn: 'root'
})

export class ReportService extends BaseService<ReportFile> {

  private readonly baseUrl = AppConfigService.appCongif.url;


  private reportListObs: BehaviorSubject<Array<ReportFile>> = new BehaviorSubject<ReportFile[]>([]);



  reportList: ReportFile[] = [];
  constructor(http: HttpClient) {
    super(http);
    this.path="Report";


  }

  getReport(param: any) {
    //(("Get Report From Service: ", param);
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.post<any>(this.baseUrl + '/Report/getReport', param, { headers: this.apiHeaders });
  }

  getReportForDesigner(reportParams) {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<string>(this.baseUrl + '/Report/getReportForDesigner?' + reportParams, { headers: this.apiHeaders } );
  }

  savefile(param: any) {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.post<any>(this.baseUrl + '/Report/savefile', param, { headers: this.apiHeaders } );
  }



  setReportList(reportType, reportTypeID): Promise<boolean> {
    return new Promise((acc, rej) => {
      this.getReportListFromApi(reportType, reportTypeID).subscribe(rpt => {
        this.reportList = rpt;

      }, err => {
        acc(false);
      }, () => {
        //((this.reportList);
        this.reportListObs.next(this.reportList);
        acc(true);
      });

    });
  }


  getReportList(): Observable<ReportFile[]> {
    return this.reportListObs.asObservable();
  }

  getReportListFromApi(reportType, reportTypeID): Observable<ReportFile[]> {

    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    let params = {
      reportType: reportType,
      reportTypeID: reportTypeID
    }
    return this.http.get<ReportFile[]>(this.baseUrl + '/Report/getReportList', { headers: this.apiHeaders,params: params } );
  }


  getReportGeneric(reportParameters): Observable<string> {

    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<string>(this.baseUrl + '/Report/getReportGeneric?' + reportParameters,{ headers: this.apiHeaders } );
  }

  setDefaultReport(reportID, reportType, reportTypeID): Observable<boolean> {

    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));

    return this.http.get<boolean>(this.baseUrl + "/Report/setDefaultReport?reportId="+reportID+
    "&reportType="+reportType+"&reportTypeId="+reportTypeID, { headers: this.apiHeaders } );
  }

  cancelDefaultReport(reportType, reportTypeId): Observable<string> {

    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<string>(this.baseUrl + "/Report/cancelDefaultReport?reportType="+reportType+
      "&reportTypeId="+reportTypeId, { headers: this.apiHeaders } );
  }

  deleteReport(reportID):Observable<boolean>
  {
    this.apiHeaders = this.apiHeaders.set('Authorization', 'Bearer ' + localStorage.getItem('token'));
    return this.http.get<boolean>(this.baseUrl + "/Report/reportDelete?reportID="+reportID, { headers: this.apiHeaders } );
  }
}
