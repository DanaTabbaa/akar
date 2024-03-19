import { Component, OnInit } from '@angular/core';
import { reloadPage } from 'src/app/core/helpers/router-helper';
import { TokenStorageService } from 'src/app/core/services/backend-services/authentication/token-storage.service';
import {TranslateService} from '@ngx-translate/core';
import { CONTROLPANEL } from 'src/app/core/constants/constant';
import { selectLang } from 'src/app/core/helpers/style-helper';
import { SharedService } from 'src/app/shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})

export class NavBarComponent implements OnInit {
  lang:string="";
  supportlanguages=['ar','en'];
  constructor(private tokenService:TokenStorageService,
    private translateService:TranslateService,
    private sharedService:SharedService,
    private spinner:NgxSpinnerService,
    ) { }
  ngOnInit(): void {
    this.getUserData();
    this.getLanguage();
    // this.lang=localStorage.getItem("language")!;
    // //(("this. lang",this.lang)
  }
  getLanguage() {
    this.sharedService.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  logOut()
  {
    this.tokenService.signOut();
    localStorage.removeItem('USER_PERMISSIONS');
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    reloadPage();
  }
  changeToEnglish()
  {

     this.spinner.show();
     localStorage.setItem("language",'en');
     this.sharedService.setLanguage('en');
     selectLang('en',this.translateService,CONTROLPANEL);

     setTimeout(() => {
       reloadPage();
       this.spinner.hide();
     },500);

  }
  changeToArabic()
  {
    this.spinner.show();
     localStorage.setItem("language",'ar');
     this.sharedService.setLanguage('ar');
     selectLang('ar',this.translateService,CONTROLPANEL);
     setTimeout(() => {
      reloadPage();
      this.spinner.hide();
    },500);


  }
   userData:any
   userName
  getUserData()
  {

    this.userData= this.tokenService.getUser();
    this.userName= this.userData?.userName;
  }

}
