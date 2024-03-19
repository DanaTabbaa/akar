import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Accounts } from 'src/app/core/models/accounts';
import { DateModel } from 'src/app/core/view-models/date-model';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss']
})
export class EntryComponent implements OnInit {

  entryForm!:FormGroup;
  entryDate!:DateModel;
  ownerAccounts:Accounts[] =[];
  tenantAccounts:Accounts[] = [];
  constructor(private fb: FormBuilder ) { }

  ngOnInit(): void {
    
    this.entryForm = this.fb.group({
      id: 0,
      code: ['', Validators.compose([Validators.required])],
      

    })

  }

  save()
  {}
  //Methods
  get f(): { [key: string]: AbstractControl } {
    return this.entryForm.controls;
  }

  onEntryDateSelect(e:DateModel)
  {
    this.entryDate = e;
  }

}
