import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { Customer } from './customer';


// function without using parameters
// function ratingRange(c: AbstractControl) : {[key:string]: boolean } |null {
//   if(c.value !== null && (isNaN(c.value) || c.value < 1 || c.value > 5)){
//     return {range: true};
//   }
//   return null;
// }


// modified function by passing parameters, by wrapping it in factory function, which can take more than one parameter
function ratingRange(min: number, max: number) : ValidatorFn {
  return (c: AbstractControl): {[key: string]: boolean} | null => {
    if(c.value !== null && (isNaN(c.value) || c.value < min || c.value > max )){
      return { 'range': true }
    }
    return null;
  }
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})

export class CustomerComponent implements OnInit {
  customerForm: FormGroup;
  // manages instance of customer data that we are binding to in our template
  customer = new Customer();

  // creating custom validator

  constructor(private fb: FormBuilder) { }

// Array syntax is used to add Validators to formControl elements

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: [{value: 'Mortey', disabled: false}, [Validators.required, Validators.maxLength(50)]],
      email: ['', [Validators.email, Validators.required]],
      phone: '',
      rating: [null, ratingRange(1,5)],
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
      //to use multiple validators use array of validators
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