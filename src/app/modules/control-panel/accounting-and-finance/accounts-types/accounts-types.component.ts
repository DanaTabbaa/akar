import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountsTypesService } from 'src/app/core/services/backend-services/accounts-types.service';

@Component({
  selector: 'app-accounts-types',
  templateUrl: './accounts-types.component.html',
  styleUrls: ['./accounts-types.component.scss']
})
export class AccountsTypesComponent implements OnInit {
//properties
  AccountTypeForm!: FormGroup;
  sub: any;
  url: any;
  id: any = 0;


//
//constructor

  constructor( private router: Router,
    private AccountsTypesService: AccountsTypesService,
    private fb: FormBuilder, private route: ActivatedRoute) {
    this.AccountTypeForm = this.fb.group({
      id: 0,
      accountTypeArName: '',
      accountTypeEnName: '',

    })
  }
  ///
//oninit
  ngOnInit(): void {

    this.sub = this.route.params.subscribe(params => {

      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {

          this.getAccountTypeById(this.id);
        }
        this.url = this.router.url.split('/')[2];

      }

    })

  }
  //
  //methods
  saveAccountType() {
    if (this.id == 0) {
      this.AccountsTypesService.addRequest(this.AccountTypeForm.value).subscribe(
        result => {
          if (result != null) {

            this.router.navigate(['/control-panel/accounting/accounts-types-list']);

          }
        },
        error => console.error(error))

    }
    else {
      this.AccountTypeForm.value.id = this.id;
      this.AccountsTypesService.update(this.AccountTypeForm.value).subscribe(
        result => {
          if (result != null) {
            this.router.navigate(['/control-panel/accounting/accounts-types-list']);

          }
        },
        error => console.error(error))
    }
  }
  getAccountTypeById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.AccountsTypesService.getById(id).subscribe({
        next: (res: any) => {
          this.AccountTypeForm.setValue({
            id: res.data.id,
            accountTypeArName: res.data.accountTypeArName,
            accountTypeEnName: res.data.accountTypeEnName,

          });

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


  //




}
