import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsTypes } from 'src/app/core/models/accounts-types';
import { AccountsTypesService } from 'src/app/core/services/backend-services/accounts-types.service';

@Component({
  selector: 'app-accounts-types-list',
  templateUrl: './accounts-types-list.component.html',
  styleUrls: ['./accounts-types-list.component.scss']
})
export class AccountsTypesListComponent implements OnInit {

  constructor(private router: Router,private AccountsTypesService:AccountsTypesService) { }

  ngOnInit(): void {
    this.getAccountsTypes()
  }
  AccountsTypes :AccountsTypes[]=[];

  getAccountsTypes() {

    const promise = new Promise<void>((resolve, reject) => {
      this.AccountsTypesService.getAll("GetAll").subscribe({
        next: (res: any) => {
          this.AccountsTypes = res.data.map((res: AccountsTypes[]) => {
            return res
          });
          resolve();
          //(("res", res);
          //((" this.AccountsTypes", this.AccountsTypes);
        },
        error: (err: any) => {
          reject(err);
        },
        complete: () => {

        },
      });
    });
    return promise;


  }

  delete(id:any)
  {
    ;
    this.AccountsTypesService.delete(id).subscribe(resonse=>{
      //(("delete response",resonse);
      this.getAccountsTypes();
    });
  }


  navigatetoupdate(id: string) {
    ;
    this.router.navigate(['/control-panel/accounting/update-account-type', id]);
  }
  navigate(urlroute: string) {
    this.router.navigate([urlroute]);
  }

}
