import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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

// Array syntax is used to add Validators to formControl elements

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: [{value: 'Mortey', disabled: false}, [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.email, Validators.required]],
      phone: '',
      notification: 'email',
      sendCatalog: true
    })
  }

  save() {
    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setNotification(notify: string){
    const phoneControl = this.customerForm.get('phone');
    if(notify === 'text'){
      phoneControl.setValidators(Validators.required);
    }else{
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity(); //reevaulating phone formControl validation state
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