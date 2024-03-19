import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';
import { UserManagerComponent } from './permissions/user-manager/user-manager.component';
import { UserRegisterationRequestComponent } from './user-registeration-request/user-registeration-request.component';
import { UserPermissionsComponent } from './permissions/user-permissions/user-permissions.component';
import { RolesPermissionsListComponent } from './permissions/roles-permissions-list/roles-permissions-list.component';
import { AddSubUsersComponent } from './permissions/user-manager/add-sub-users/add-sub-users.component';
import { ChangePasswordComponent } from './permissions/change-password/change-password.component';



const routes: Routes = [{
 path:'',component:AdminPanelComponent,children:[
     {path:"user-registeration-request",component:UserRegisterationRequestComponent},
     {path:"user-manager",component:UserManagerComponent},
     {path:"change-password",component:ChangePasswordComponent},
     {path:"update-user/:id",component:AddSubUsersComponent},
     {path:"add-sub-user",component:AddSubUsersComponent},
     {path:"update-role-permissions/:id",component:UserPermissionsComponent},
     {path:"add-role-permissions",component:UserPermissionsComponent},
     {path:"roles-permissions",component:RolesPermissionsListComponent}



 ]

}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminPanelRoutingModule { }
