

import { Component, OnInit, HostListener,ElementRef, Renderer2 } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { WEBSITE } from 'src/app/core/constants/constant';
import { selectLang } from 'src/app/core/helpers/style-helper';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { AddPropertyDialogComponent } from '../add-property-dialog/add-property-dialog.component';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isArabic = false;
  isEnglish = false;
  supportlanguages=['ar','en'];
  isMobile: boolean = false;
  isDesktop: boolean = false;
  scrollPosition: number = 0;
  lang:string="ar";
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkWindowSize();
  }
  constructor(
    private translateService:TranslateService,
    private dialog: MatDialog,
    private elementRef: ElementRef,
    private renderer: Renderer2) {

    this.translateService.addLangs(this.supportlanguages);
     this.translateService.setDefaultLang('ar');
  }


  checkWindowSize() {
    this.isMobile = window.innerWidth < 768;
    this.isDesktop = window.innerWidth >= 768;
  }
  scrollToSection() {
    const targetSection = document.getElementById('target-section');
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
  openLoginDialog(): void {
    this.dialog.open(DialogComponent, {
    });
  }
  openAddPropertyDialog(): void {
    if(localStorage.getItem('token'))
    {
      this.dialog.open(AddPropertyDialogComponent, {
      });
    }
    else
    {
      this.dialog.open(DialogComponent, {
      });
    }
    
  }
  @HostListener('window:scroll', [])
  //  to change style header with different color
  onWindowScroll() {
    this.scrollPosition = window.pageYOffset;
    if(this.isMobile){
      if (this.scrollPosition > 20) {
        const headerElement = document.getElementById('header');
        const headerFirst = document.getElementById('header-first');
        if (headerElement && headerFirst) {
          headerElement.style.setProperty('background', 'linear-gradient(180deg, rgba(0, 109, 124, 0.72) 0%, rgba(0, 62, 71, 0.00) 159.82%)', 'important');
          headerFirst.style.setProperty('border-bottom', 'none', 'important');
          headerElement.style.setProperty('backdrop-filter', 'blur(5px)', 'important');
  
        }
      }else{
        const headerElement = document.getElementById('header');
        const headerFirst = document.getElementById('header-first');
        if (headerElement && headerFirst) {
          headerElement.style.setProperty('background', 'transparent', 'important');
          headerFirst.style.setProperty('border-bottom', '1px white solid', 'important');
          headerElement.style.setProperty('backdrop-filter', 'none', 'important');
  
        }
      }
    }
  }

  ngOnInit(): void {
    this.checkWindowSize();
    this.lang = localStorage.getItem("language")??"ar";
    this.isArabic =  localStorage.getItem('language') == 'ar' ? true : false
    this.isEnglish = localStorage.getItem('language') == 'en' ? true : false
  }

  selectLang(lang:string)
  {
    selectLang(lang,this.translateService,WEBSITE);
    window.location.reload();
   }

}
