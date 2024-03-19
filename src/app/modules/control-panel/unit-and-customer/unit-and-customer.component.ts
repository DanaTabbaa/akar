import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unit-and-customer',
  templateUrl: './unit-and-customer.component.html',
  styleUrls: ['./unit-and-customer.component.scss']
})
export class UnitAndCustomerComponent implements OnInit {

  constructor(private router: Router) {

  }

  ngOnInit(): void {

    //((this.router.url)
  }

}
