import { Injectable } from "@angular/core";
import { IAppConfig } from '../../interfaces/api-config';
import { HttpClient } from '@angular/common/http';
@Injectable(
    {providedIn:"root"}
)


export class AppConfigService{
    static appCongif :IAppConfig
    constructor(private http:HttpClient)
    {
      
    }
    loadConfig()
    {
        return  new Promise<void>((resolve, reject) => {
            this.http.get<IAppConfig>("assets/config/api-config.json").toPromise().then(appConfig=>{
                console.log('appConfigappConfigappConfigappConfigappConfig',appConfig);
                
                AppConfigService.appCongif  ={...appConfig};
                resolve();

            }).catch(err=>{
                reject();
            })
        })


    }
}
