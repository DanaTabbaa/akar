// import {PipeTransform} from '@angular/core';

import { AlertTypes } from "../core/constants/enumrators/enums";



import { TranslatePipe } from "@ngx-translate/core";
import { NotificationsAlertsService } from "../core/services/local-services/notifications-alerts.service";
import { FormGroup } from "@angular/forms";




export function stringIsNullOrEmpty(item: string) {

    return !(item && item.toString().length > 0 && item != ' ');
}

export function TrimSpcialCharacter(item: string, char: string = ',') {
    const lastIndex = item.trim().lastIndexOf(char);
    if (lastIndex > 0) {
        return item.substring(0, lastIndex);
    }
    return item;
}


export function ObjectIsNotNullOrEmpty(item: object) {
    if (item) {
        const containProperties = Object.keys(item).length > 0;
        return containProperties;
    }
    return false;
}


export function convertDataURIToBinary(dataURI: string, BASE64_MARKER = ';base64,'): number[] {
    const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const base64 = dataURI.substring(base64Index);
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }

    return Array.from(array);
}



export function getIds(weekDaysOff: string): any[] {
    if (!stringIsNullOrEmpty(weekDaysOff)) {
        const ids = [];
       // weekDaysOff.split(',').forEach(i => { ids.push(+i.trim()); });
        return ids;
    }
    return [];
}


export function searchName(text: string,  data): any[] {
    return data.filter(item => {
      const term = text.toLowerCase();
      return item.name.toLowerCase().includes(term)
        //   || pipe.transform(country.area).includes(term)
        //   || pipe.transform(country.population).includes(term);
    });
  }

 export function refreshPaging(data:any[], pageSize, page) {
    //this.countries = COUNTRIES
      return data.map((item, i) => ({id: i + 1, ...item}))
      .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  }


  export function isEmptyArray<T>(arr: T[]): boolean {
    return arr.length === 0;
  }


  export function showResponseMessage(translate:TranslatePipe,alertsService:NotificationsAlertsService, responseStatus, alertType, message) {
    if (responseStatus == true && AlertTypes.success == alertType) {
      alertsService.showSuccess(message, translate.transform("messageTitle.done"));
    } else if (responseStatus == true && AlertTypes.warning) {
      alertsService.showWarning(message, translate.transform("messageTitle.alert"));
    } else if (responseStatus == true && AlertTypes.info) {
      alertsService.showInfo(message, translate.transform("messageTitle.info"));
    } else if (responseStatus == false && AlertTypes.error) {
      alertsService.showError(message, translate.transform("messageTitle.error"));
    }
  }

  export function checkFileAllowedExtesion(filename: string): boolean {
    let found = false;
    const mediaExtensions = [
        ".PNG", ".JPG", ".JPEG", ".BMP", ".GIF", ".XLSX", //etc
        ".WAV", ".MID", ".MIDI", ".WMA", ".MP3", ".OGG", ".RMA", //etc
        ".AVI", ".MP4", ".DIVX", ".WMV", ".PDF", ".csv", ".TXT", ".XLSB",
        ".XML", ".PPTX", ".DOCX", ".DOTX", ".DOC"
        //etc
    ];

    for (const item of mediaExtensions) {
        if (filename.toLowerCase().indexOf(item.toLowerCase()) > -1) {
            return true;
        }
    }

    return found;
}

export function checkRequiredFormFields(frm:FormGroup){
  Object.keys(frm.controls).forEach(controlName=>{
    const control = frm.get(controlName);
    if(control?.invalid)
    {
      console.log("Control Name is Invalid", controlName);
    }
  })
}



