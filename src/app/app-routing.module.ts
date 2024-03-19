import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
 
  // {path:'',loadChildren:()=>import('src/app/modules/web-site/web-site.module').then(m=>m.WebSiteModule)},
  // {path:'control-panel',loadChildren:()=>import('src/app/modules/control-panel/control-panel.module').then(m=>m.ControlPanelModule),canActivate:[AuthGuard]},
  

  { path: '',  loadChildren: () => import('src/app/modules/web-site/web-site.module').then(m => m.WebSiteModule) },
  { path: 'admin', loadChildren: () => import('src/app/modules/control-panel/control-panel.module').then(m => m.ControlPanelModule) }, // Load control-panel module lazily
  
  
  



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
