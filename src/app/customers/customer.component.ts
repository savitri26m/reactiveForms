import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

import { Customer } from './customer';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  // manages instance of customer data that we are binding to in our template
  customer = new Customer();

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: '',
      lastName: {value: 'Mortey', disabled: false},
      email: [{value: 'jane@gmail.com', disabled: true}],
      sendCatalog: true
    })
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  // patchValue allows to set only desired propertyvalue as required
  populateTestData(){
    this.customerForm.patchValue({
      firstName: 'Jack',
      lastName: 'Doe'
    })
  }

}






 // setValue allows us to set the all property values to the form element
  // populateTestData(): void{
  //   this.customerForm.setValue({
  //     firstName: 'Jack',
  //     lastName: 'Harkness',
  //     email: 'jack@gmail.com',
  //     sendCatalog: false
  //   })
  // }


  // using FormControl
  // this.customerForm = new FormGroup({
  //   firstName: new FormControl(),
  //   lastName: new FormControl(),
  //   email: new FormControl(),
  //   sendCatalog: new FormControl(),
  // })