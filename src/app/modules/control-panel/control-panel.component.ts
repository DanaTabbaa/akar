import { Component, OnInit,ComponentFactoryResolver } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationStart, Router } from '@angular/router';
import { selectLang } from 'src/app/core/helpers/style-helper';
import { TranslateService } from '@ngx-translate/core';
import { CONTROLPANEL } from '../../core/constants/constant';
import { distinctUntilChanged, map } from 'rxjs';
import { reloadPage } from 'src/app/core/helpers/router-helper';
import { SharedService } from 'src/app/shared/services/shared.service';

// declare var calender:any;
declare var colorPallet: any;
declare var mainFunction :any;
@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.scss'],
})
export class ControlPanelComponent implements OnInit {

  currentUrl: string = '';
  controlpanelComponent:string="ControlPanelComponent";
  dashboardChild:string="app-dashboard"
  firstChild: string = '';
  parentComponent: string = '';
  isCurrentComponentDashboard:boolean=false;
  isTokenExpired:boolean=false;
  userToken!:string;
  language!:string;
  activeSelector
  constructor(
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService:SharedService,
    private resolver: ComponentFactoryResolver
  ) {

    this.language=localStorage.getItem("language")!
    new colorPallet();
    selectLang(this.language,this.translateService, CONTROLPANEL);
    route.url.subscribe(() => {

     });
  }

  ngOnInit(): void {
  //  this.getShowToolbarSource()
     mainFunction()

  }

   onActivated(component) {
    this.activeSelector =this.resolver.resolveComponentFactory(component.constructor).selector;
    this.checkCurrentComponentIsDashboard();

   }


  checkCurrentComponentIsDashboard()
  {

    if(this.dashboardChild==this.activeSelector)
    {

      this.isCurrentComponentDashboard=true;
    }else{
      this.isCurrentComponentDashboard=false;
    }
  }

  getShowToolbarSource() {
    this.sharedService.getShowToolbarSource().subscribe(result => {
      this.isCurrentComponentDashboard = result;
    })
  }



}
