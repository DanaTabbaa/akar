import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "filter"
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchText: string,  arNameKey:string="", enKeyName:string="" ): any[] {

    if (!items) return [];
    if (!searchText) return items;

    // TODO: need to improve this filter
    // because at this moment, only filter by boatType
    var lang = localStorage.getItem("language");
    if (lang == "ar") {
     // var res = items.filter(item => item.screenNameAr.toLowerCase().indexOf(searchText) !== -1);
      var res =  items.filter(item => {
          return item[arNameKey].toLowerCase().includes(searchText.toLowerCase());
        });
      return res;
    }
    else {
      var res =  items.filter(item => {
        return item[enKeyName].toLowerCase().includes(searchText.toLowerCase());
      });
      return res;
    }

    // return items.filter(item => {
    //   return item.boatType.toLowerCase().includes(searchText.toLowerCase());
    // });
  }
}
