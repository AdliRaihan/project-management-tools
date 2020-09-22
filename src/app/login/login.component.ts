import { global } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import * as firebase from 'firebase/app';
import 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  profileForm = new FormGroup({  
    email : new FormControl(''),
    password : new FormControl(''),
    asd : new FormControl('')
  })

  constructor() {
    
  }

  ngOnInit(): void {
    this.profileForm.valueChanges.subscribe(able => {
      console.warn(able)
    })
  }

  onFormSubmit() {
    // alert()
    var email = this.profileForm.value["email"]
    var password = this.profileForm.value["password"]
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch( reject => {
      this.animateFailedForm()
    })
  }

  animateFailedForm () {
    var emailField = document.getElementById('email')
    var passwordField = document.getElementById('password')
    this.animateNow(emailField)
    this.animateNow(passwordField)
  }

  animateNow(field: Element) {
    field.animate([
      {borderColor: 'rgba(0,0,0,0)'},
      {borderColor: 'red'}
    ],{
      duration: 500,
      easing: 'ease-in-out',
      fill: 'forwards'
    })
  }

}
