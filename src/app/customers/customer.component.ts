import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidatorFn, FormArray } from '@angular/forms';
import {debounceTime } from 'rxjs/operators';
 
import { Customer } from './customer';


// ------------------------- Custom Range Validation -----------------------------------
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
      return { 'range': true } //key is the name of broken validation rule
    }
    return null;
  }
}
// --------------------------- Cross field email validation --------------------------------
function emailMatcher(c:AbstractControl): { [key: string]: boolean} | null {
  const emailControl = c.get('email');
  const confirmEmailControl = c.get('confirmEmail');

  // if both the form controls are not yet been touched, we do not want to show error messages
  if(emailControl.pristine || confirmEmailControl.pristine) {
    return null
  }

  if(emailControl.value !== confirmEmailControl.value) {
    return { 'match': true } //key is the name of broken validation rule
  }
  return null
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

  get addresses(): FormArray {
    return <FormArray>this.customerForm.get('addresses')
  }


// ----------------------- Removing Validations from HTML for email only ------------------------
  emailMessages: string; // property to display error messages
  private validationMessages = {
    required: 'Please enter your email address',
    email: 'Please enter a valid email address '
  }

  constructor(private fb: FormBuilder) { }

// Array syntax is used to add Validators to formControl elements

  ngOnInit() {
    this.customerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(5)]],
      lastName: [{value: 'Mortey', disabled: false}, [Validators.required, Validators.maxLength(50)]],
      emailGroup: this.fb.group({
        email: ['', [Validators.email, Validators.required]],
        confirmEmail: ['', Validators.required],
      }, { validators: emailMatcher }),  // while providing validator for formGroup we provide it as an object as key value pair
      phone: '',
      rating: [null, ratingRange(1,5)],
      notification: 'email',
      sendCatalog: false,
      addresses: this.fb.array([ this.buildAddress() ])
      // addresses: this.buildAddress() //creating instance of address formGroup
    })

    //using watcher instead of click events to bind the values selected by user
    this.customerForm.get('notification').valueChanges.subscribe(
      (value) => this.setNotification(value)
    )

    // email watcher code
      const emailControlVar = this.customerForm.get('emailGroup.email');
      emailControlVar.valueChanges.pipe(
        debounceTime(1000)
      ).subscribe(
        value => this.setMessages(emailControlVar)
      )

  }

  // refactoring address formFroup
  buildAddress(): FormGroup{
    return this.fb.group({
      addressType: 'home',
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: ''
    })
  }

  setMessages(c: AbstractControl): void {
    this.emailMessages = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessages = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
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


  // adding a new address instance
  addAddresses(): void {
    this.addresses.push(this.buildAddress())
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