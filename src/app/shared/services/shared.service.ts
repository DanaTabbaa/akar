import { Injectable } from '@angular/core';
import { ComponentType } from 'ngx-toastr';

import { BehaviorSubject, Observable } from 'rxjs';
import { ComponentInfo } from 'src/app/core/interfaces/component-info';
import { LocationDetails } from 'src/app/core/interfaces/location-details';
import { ToolbarButtonsAppearance } from 'src/app/core/interfaces/toolbar-buttons-appearance';
import { ToolbarData } from 'src/app/core/interfaces/toolbar-data';
import { ToolbarPath } from 'src/app/core/interfaces/toolbar-path';
import { RolesPermissionsVm } from 'src/app/core/models/ViewModel/permissions/roles-permissions-vm';
import { PagePermission } from 'src/app/core/models/pages-permissions/page-permissions';
import { UserPermission } from 'src/app/core/models/permissions/user-permissions';
import { ResponsiblePersons } from 'src/app/core/models/responsible-persons';
import { ContractSettingsRolePermissions } from 'src/app/core/models/contract-settings-role-permissions';
import { OpportunityImages } from 'src/app/core/models/opportunity-images';
import { EntryTypeRolesPermissions } from 'src/app/core/models/entry-type-roles-permissions';
export  interface ButtonStatus {
  button:any;
   disabled:boolean;
  }
@Injectable({
  providedIn: 'root',
})

export class SharedService {
  private userPermissionsSource: BehaviorSubject<UserPermission> =new BehaviorSubject<UserPermission>({} as UserPermission);
  private contractPermissionsSource: BehaviorSubject<ContractSettingsRolePermissions> =new BehaviorSubject<ContractSettingsRolePermissions>({} as ContractSettingsRolePermissions);
  private buttonSource: BehaviorSubject<ToolbarData> =new BehaviorSubject<ToolbarData>({} as ToolbarData);
  private buttonAppearanceSource: BehaviorSubject<ToolbarButtonsAppearance> =new BehaviorSubject<ToolbarButtonsAppearance>({} as ToolbarButtonsAppearance);
  private pathSource: BehaviorSubject<ToolbarPath> =new BehaviorSubject<ToolbarPath>({} as ToolbarPath);
  private lageuageSource: BehaviorSubject<string> =new BehaviorSubject<string>(localStorage.getItem("language")!);
  private componentInfoSource: BehaviorSubject<ComponentInfo> =new BehaviorSubject<ComponentInfo>({} as ComponentInfo);
  private reloadSidebarSubject = new BehaviorSubject<boolean>(false);
  private locationSource: BehaviorSubject<LocationDetails> =new BehaviorSubject<LocationDetails>({} as LocationDetails);
  private showToolbarSourceSubject = new BehaviorSubject<boolean>(false);
  private buttonStatusSource: BehaviorSubject<ButtonStatus> =new BehaviorSubject<ButtonStatus>({} as ButtonStatus);
  private responsibleDataSource: BehaviorSubject<ResponsiblePersons> =new BehaviorSubject<ResponsiblePersons>({} as ResponsiblePersons);

  private responsibleListDataSource: BehaviorSubject<ResponsiblePersons[]> =new BehaviorSubject<ResponsiblePersons[]>([]);
  private opportUityImagesListDataSource: BehaviorSubject<OpportunityImages[]> =new BehaviorSubject<OpportunityImages[]>([]);
  private entryTypePermissionsSource: BehaviorSubject<EntryTypeRolesPermissions> =new BehaviorSubject<EntryTypeRolesPermissions>({} as EntryTypeRolesPermissions);

  private permissionStatusSubject: BehaviorSubject<{permissionStatus:number}> =new BehaviorSubject({permissionStatus:0});

  // Subscribe to changes in the boolean subject



  //currentButton = this.buttonSource.asObservable();

  constructor() {}
  public changeButton(toolbarData: ToolbarData) {


    this.buttonSource.next(toolbarData);
  }
  public getClickedbutton(): Observable<ToolbarData> {
    return this.buttonSource.asObservable();
  }
  public changeButtonApperance(toolbarButtons: ToolbarButtonsAppearance) {
    this.buttonAppearanceSource.next(toolbarButtons);
  }

  public getAppearanceButtons(): Observable<ToolbarButtonsAppearance> {
    return this.buttonAppearanceSource.asObservable();
  }

  public changeToolbarPath(toolbarPath: ToolbarPath) {

    this.pathSource.next(toolbarPath);
  }

  public getToolbarPath(): Observable<ToolbarPath> {
    return this.pathSource.asObservable();
  }


  public setLanguage(lang: string) {

    this.lageuageSource.next(lang);
  }

  public getLanguage(): Observable<string> {

    return this.lageuageSource.asObservable();
  }


  public getUserPermissions(): Observable<UserPermission> {

    return this.userPermissionsSource.asObservable();
  }

  public setUserPermissions(userPermissions: UserPermission) {

    this.userPermissionsSource.next(userPermissions);
  }


  public setContractPermissions(contractPermissions: ContractSettingsRolePermissions) {
    this.contractPermissionsSource.next(contractPermissions);
  }

  public getContractPermissions() {
    return this.contractPermissionsSource.asObservable();
  }

  public setPermissionsStatus(permissionStatus: {permissionStatus:number}) {
    this.permissionStatusSubject.next(permissionStatus);
  }

  public getPermissionsStatus() {
    return this.permissionStatusSubject.asObservable();
  }



  public setEntryTypePermissions(entryTypePermission: EntryTypeRolesPermissions) {
    this.entryTypePermissionsSource.next(entryTypePermission);
  }

  public getEntryTypePermissions() {
    return this.entryTypePermissionsSource.asObservable();
  }

  public setComponentInfo(componentInfo: ComponentInfo) {

    this.componentInfoSource.next(componentInfo);
  }
  public getComponentInfo(): Observable<ComponentInfo> {
    return this.componentInfoSource.asObservable();
  }
  public setReloadSidebarStatues(reloadFlag: boolean) {

    this.reloadSidebarSubject.next(reloadFlag);
  }
  public getReloadSidebarStatues(): Observable<boolean> {
    return this.reloadSidebarSubject.asObservable();
  }

  public setLocationDetails(loctionDetails: LocationDetails) {

    this.locationSource.next(loctionDetails);
  }
  public getLocationDetails(): Observable<LocationDetails> {
    return this.locationSource.asObservable();
  }

  public setShowToolbarSource(showToolbar: boolean) {

    this.showToolbarSourceSubject.next(showToolbar);
  }
  public getShowToolbarSource(): Observable<boolean> {
    return this.showToolbarSourceSubject.asObservable();
  }
  public changeButtonStatus(buttonStatus: ButtonStatus) {


    this.buttonStatusSource.next(buttonStatus);
  }
  public getButtonStatus(): Observable<ButtonStatus> {
    return this.buttonStatusSource.asObservable();
  }
  public setResponsibleData(ResponsiblePerson: ResponsiblePersons) {


    this.responsibleDataSource.next(ResponsiblePerson);
  }
  public getResponsibleData(): Observable<ResponsiblePersons> {
    return this.responsibleDataSource.asObservable();
  }
  public setResponsibleListData(responsiblePersons: ResponsiblePersons[]) {


    this.responsibleListDataSource.next(responsiblePersons);
  }
  public getResponsibleListData(): Observable<ResponsiblePersons[]> {
    return this.responsibleListDataSource.asObservable();
  }




  public setOpportunityImagesListData(opportunityImages: OpportunityImages[]) {


    this.opportUityImagesListDataSource.next(opportunityImages);
  }
  public getOpportunityImagesListData(): Observable<OpportunityImages[]> {
    return this.opportUityImagesListDataSource.asObservable();
  }


}
