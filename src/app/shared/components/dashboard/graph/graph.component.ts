import { Component, OnInit } from '@angular/core';
import { ContractStaisticsVM } from 'src/app/core/models/ViewModel/contract-staistics-vm';
import { SharedService } from 'src/app/shared/services/shared.service';
import { RentContractsService } from 'src/app/core/services/backend-services/rent-contracts.service';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {
  lang: string = '';
    ////Units bar chart
    countMonth!: any[];

    year: any = new Date().getFullYear() + 2;
    rang: any[] = [];
    cardTypes: any[] = [];
    trailerTypes: any[] = [];
    dateParts: any[] = [];
    today: any = new Date();
    dd: any;
    mm: any;
    currYear: any;
    month_nameen = ['January', 'February ', 'March ', 'April', 'May  ', 'June  ', 'July  ', 'August ', 'September ', 'October ', 'November ', 'December'];
    month_name = ['يناير', 'فبراير', 'مارس', 'ابريل', 'مايو', 'يونيو', 'يوليو', 'اغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
    months!: ContractStaisticsVM[];
    contractsAndCount!: ContractStaisticsVM[];

    monthnumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    sumation: any;
    label!: string;
    chart!: any;



    ////

  constructor(private SharedServices: SharedService, private rentContractsService: RentContractsService,) { }

  ngOnInit(): void {
    this.getLanguage()
    this.setmonths();

  }
  getLanguage() {
    this.SharedServices.getLanguage().subscribe(res => {
      this.lang = res
    })
  }
  getSum() {

    this.sumation = this.countMonth.reduce((acc, cur) => acc + cur, 0);
    console.log("sumation", this.sumation)


  }
  getNowDate() {
    // ;
    this.today = new Date();
    this.dd = this.today.getDate();
    this.mm = this.today.getMonth() + 1; //January is 0!
    this.currYear = this.today.getFullYear();
    if (this.dd < 10) {
      this.dd = '0' + this.dd;
    }
    if (this.mm < 10) {
      this.mm = '0' + this.mm;
    }
    this.today = this.mm + '/' + this.dd + '/' + this.currYear;
    return this.today;
  }
  setmonths() {
    this.getNowDate();
    this.months = [];
    this.countMonth = [];
    this.rentContractsService.getRentContractAndMonths().subscribe(result => {
      if (result != null) {
        console.log("chart result", result);
         
        this.contractsAndCount = result;
        this.monthnumbers.forEach(element => {
          let x = new ContractStaisticsVM;
          x.count = this.contractsAndCount.filter(x => x.month == element).length;
          this.countMonth.push(x.count);
          x.month = element;
          x.monthnamear = this.month_name[element - 1];
          x.monthnameen = this.month_nameen[element - 1];
          this.months.push(x);
        });
        console.log(this.months);
      }
      this.showChart();
    });
  }
  showChart() {
     
    this.getSum();
    console.log("language chart", this.lang);
    this.label = this.lang == 'en' ? "Total number of units:" + this.sumation : " العدد الكلي للوحدات: " + this.sumation;
    console.log("show Chart");
    this.chart = new Chart('lineCharts', {
      type: 'line',
      data: {
        labels: this.lang == 'en' ? this.month_nameen : this.month_name, // your labels array

        datasets: [
          {

            label: this.label,

            data: this.countMonth, // your data array
            backgroundColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(230, 25, 75, 1)',
              'rgba(60, 180, 75, 1)',
              'rgba(245, 130, 48, 1)',
              'rgba(145, 30, 180, 1)',
              'rgba(210, 245, 60, 1)',
              'rgba(0, 128, 128, 1)',
              'rgba(128, 0, 0, 1)'

            ],
            fill: true,
            lineTension: 0.1,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        title: {
          text: this.lang == 'en' ? " The number of rented units during this year  " + this.currYear : " عدد الوحدات المؤجرة خلال  لسنة " + this.currYear,
          display: true
        }
,
        scales: {
          yAxes: [{
            ticks: {
              min: 0,
              stepSize: 1,
            }
          }]
        }
       }
    });

    console.log("char", this.chart);
  }
}
