import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ToolbarActions } from 'src/app/core/constants/enumrators/enums';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { ContractsTypesService } from 'src/app/core/services/backend-services/contracts-types.service';
import { NotificationsAlertsService } from 'src/app/core/services/local-services/notifications-alerts.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import {Subscription} from 'rxjs'
import { NAME_REQUIRED_VALIDATORS } from 'src/app/core/constants/input-validators';

@Component({
  selector: 'app-contracts-types',
  templateUrl: './contracts-types.component.html',
  styleUrls: ['./contracts-types.component.scss']
})
export class ContractsTypesComponent implements OnInit,OnDestroy {
//properties
ContractsTypesForm!: FormGroup;
  sub: any;
  url: any;
  id: any = 0;
  addUrl: string = '/control-panel/settings/add-contract-type';
  updateUrl: string = '/control-panel/settings/update-contract-type/';
  listUrl: string = '/control-panel/settings/contracts-types-list';
  toolbarPathData: ToolbarPath = {
    listPath: '',
    updatePath: this.updateUrl,
    addPath: this.addUrl,
    componentList:"component-names.list-contracts-types",
    componentAdd: "component-names.add-contract-type",
  };

  //


//constructor

  constructor( private router: Router,
    private translate:TranslatePipe,
    private sharedServices:SharedService,
    private alertsService:NotificationsAlertsService,
    private contractsTypesService:ContractsTypesService,
    private fb: FormBuilder, private route: ActivatedRoute) {
    this.ContractsTypesForm = this.fb.group({
      id: 0,
      contractTypeArName: NAME_REQUIRED_VALIDATORS,
      contractTypeEnName: NAME_REQUIRED_VALIDATORS,

    })
  }

//
//#region ngOnDestory
ngOnDestroy() {
  this.subsList.forEach((s) => {
    if (s) {
      s.unsubscribe();
    }
  });
}
//#endregion

//oninit
    ngOnInit(): void {

    this.listenToClickedButton();
    this.changePath();
    this.sub = this.route.params.subscribe(params => {

      if (params['id'] != null) {
        this.id = +params['id'];
        if (this.id > 0) {

          this.getContractsTypesById(this.id);
        }
        this.url = this.router.url.split('/')[2];

      }

    })

  }
//
//Methods


errorMessage='';
errorClass='';

saveContractType() {
    if(this.ContractsTypesForm.valid)
    {
    if (this.id == 0) {

      //(("ContractsTypesForm", this.ContractsTypesForm.value)

      this.contractsTypesService.addRequest(this.ContractsTypesForm.value).subscribe(
        result => {
          if (result != null) {

            this.router.navigate(['/control-panel/settings/contracts-types-list']);

          }
        },
        error => console.error(error))

    }
    else {

      ;
      this.ContractsTypesForm.value.id = this.id;
      //(("this.ContractsTypesForm.value", this.ContractsTypesForm.value)
      this.contractsTypesService.update(this.ContractsTypesForm.value).subscribe(
        result => {
          if (result != null) {

            this.router.navigate(['/control-panel/settings/contracts-types-list']);

          }
        },
        error => console.error(error))
    }
  }else{
    this.errorMessage = this.translate.transform("validation-messages.invalid-data");
      this.errorClass = 'errorMessage';
      this.alertsService.showError(this.errorMessage, this.translate.transform("message-title.wrong"));
      return this.ContractsTypesForm.markAllAsTouched();
  }
  }
  getContractsTypesById(id: any) {
    const promise = new Promise<void>((resolve, reject) => {
      this.contractsTypesService.getById(id).subscribe({
        next: (res: any) => {
          ;
          //(("result data getbyid", res.data);
          this.ContractsTypesForm.setValue({
            id: res.data.id,
            contractTypeArName: res.data.contractTypeArName,
            contractTypeEnName: res.data.contractTypeEnName,

          });
          //(("this.ContractsTypesForm.value set value", this.ContractsTypesForm.value)

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
  //#region Tabulator
  subsList: Subscription[] = [];
  currentBtnResult;
  listenToClickedButton() {
    let sub = this.sharedServices.getClickedbutton().subscribe({
      next: (currentBtn: ToolbarData) => {
        currentBtn;

        if (currentBtn != null) {
          if (currentBtn.action == ToolbarActions.List) {
            this.sharedServices.changeToolbarPath({
              listPath: this.listUrl,
            } as ToolbarPath);
            this.router.navigate([this.listUrl]);
          } else if (currentBtn.action == ToolbarActions.Save) {
            this.saveContractType();
          } else if (currentBtn.action == ToolbarActions.New) {
            this.toolbarPathData.componentAdd = "component-names.add-contract-type";

            this.sharedServices.changeToolbarPath(this.toolbarPathData);
          } else if (currentBtn.action == ToolbarActions.Update) {
            this.saveContractType();
          }
        }
      },
    });
    this.subsList.push(sub);
  }
  changePath() {
    this.sharedServices.changeToolbarPath(this.toolbarPathData);
  }

  get f(): { [key: string]: AbstractControl } {
    return this.ContractsTypesForm.controls;
  }



}
