import { Component, OnInit,Inject } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';
import { WEBSITE, CONTROLPANEL } from './core/constants/constant';
import { Store } from '@ngrx/store';
import { BuildingActions } from './core/stores/actions/building.actions';
import { Building } from './core/models/buildings';
import { BuildingSelectors } from './core/stores/selectors/building.selectors';
import { SelectedBuildingModel } from './core/stores/store.model.ts/buildings.store.model';
import { first } from 'rxjs';
import { selectLang } from './core/helpers/style-helper';
import {DOCUMENT} from '@angular/common';
declare var mainFunction :any;


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'resort-realestate-front';
  constructor(private translateService: TranslateService, private store: Store<any>,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {

  }

  currentUrl!: string
  isControlPanel!: boolean
  building: Building = new Building();
  language:string=''

  ngOnInit(): void {
     mainFunction();
    this.getUrl();
    this.language=localStorage.getItem("language")!;
    const htmlTag = this.document.getElementsByTagName("html")[0];
    if(this.language == "ar"){
      htmlTag.setAttribute("class", "direction-rtl");
    }
    else{
      htmlTag.setAttribute("class", "direction-ltr");

    }



    if(this.language!=null?this.language:this.language="en")
    {
      if (this.isControlPanel == true) {
        selectLang(this.language, this.translateService, CONTROLPANEL);

      } else {
        selectLang(this.language, this.translateService, WEBSITE);
      }
    }


    this.store.dispatch(BuildingActions.actions.setSelected({
      data: new Building()
    }))
    this.store.select(BuildingSelectors.selectors.getSelectedSelector).subscribe((data: SelectedBuildingModel) => {
      //this.building = {...data.selected}
      //(("this.store.select(BuildingSelectors.selectors.getSelectedSelector)",data)
    });
  }

  getUrl() {

    this.currentUrl = window.location.href;
    this.isControlPanel = this.currentUrl.includes("control-panel")
  }

}
