import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BaseService } from 'src/app/core/services/backend-services/base.service';
import { ManagerService } from 'src/app/core/services/backend-services/manager.service';
import { NewCode } from 'src/app/core/view-models/new-code';

@Component({
  selector: 'app-base',
  template: '',
 // styleUrls: ['./base.component.scss']
})
export class BaseComponent<T> implements OnDestroy {

  subsList:Subscription[] =[];
  constructor(protected baseService:BaseService<T>,protected managerService:ManagerService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subsList.forEach(s=>{
      if(s)
      {
        s.unsubscribe();
      }
    });

    this.managerService.destroy();
  }

  getNewCode(typeId:any=0){
    let url="";
    if(typeId)
    {
      url="?typeId="+typeId;
    }
    return new Promise<string>((resolve,reject)=>{
      let sub = this.baseService.getWithResponse<NewCode[]>("GetNewCode"+url).subscribe({
        next:(res)=>{
          
          let newCode:string = "";
          if(res.data && res.data.length){
             newCode = res.data[0].code;
          }
          resolve(newCode);
        },
        error:(err)=>{
          resolve("");
        },
        complete:()=>{}
      });
      this.subsList.push(sub);
    });
    
  }

}
