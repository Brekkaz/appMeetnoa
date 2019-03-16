import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public formLogin: FormGroup;

  constructor(private formBuilder: FormBuilder, private httpClient: HttpClient) {}

  public ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)/*, this.validatePassword*/]]
    });
  }

  public register() {
    const loginUrl = 'https://api-base.herokuapp.com/api/pub/credentials/registration';
    //const user = this.formGroup.value;
  }

  /*private validatePassword(control: AbstractControl) {
    const password = control.value;
    let error = null;
    if (!password.includes('$')) {
      error = { ...error, dollar: 'needs a dollar symbol' };
    }
    if (!parseFloat(password[0])) {
      error = { ...error, number: 'must start with a number' };
    }
    return error;
  }*/

}
