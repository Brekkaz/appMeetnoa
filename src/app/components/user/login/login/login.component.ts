import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Renderer2, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  public formLogin: FormGroup;
  public formRegister: FormGroup;
  public error={
    state:false,
    msg:''
  };

  constructor(
    private formBuilder: FormBuilder, 
    private userService: UserService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) {}

  ngOnInit() {
    this.buildForms();
    this.renderer.addClass(this.document.body, 'bgMeetnoa');
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(this.document.body, 'bgMeetnoa');
  }

  private buildForms() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.formRegister = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      birthdate: ['', [Validators.required]],
      sex: ['', [Validators.required]]
    });
  }
  
  onRegister() {
    for(let i in this.formRegister.controls)
      this.formRegister.controls[i].markAsTouched();
    if (this.formRegister.invalid) return;

    this.userService.registerEmailPasswordUser(this.formRegister.value.email, this.formRegister.value.password)
    .then(res => {
      this.userService.updateBasicUserData({
        uid: (<any>res).user.uid,
        firstname: this.formRegister.value.firstname,
        lastname: this.formRegister.value.lastname,
        email: this.formRegister.value.email,
        birthdate: this.formRegister.value.birthdate,
        sex: this.formRegister.value.sex
      });
    }).catch(err => this.showAuthError(err.code, err.message));
  }
  
  onLoginEmailPassword(): void {
    if (this.formLogin.invalid) {
      this.error = { state:true, msg:'Digite usuario y contraseña validos' };
      return;
    }

    this.userService.loginEmailPasswordUser(this.formLogin.value.email, this.formLogin.value.password)
    .then(res => console.log('res', res))
    .catch(err => this.showAuthError(err.code, err.message));
  }
  
  onLoginFacebook(): void {
    this.userService.loginFacebookUser()
    .then(res => {
      console.log('res', res);
      //this.updateUserData(credential.user)
    })
    .catch(err => this.showAuthError(err.code, err.message));
  }
  
  onLoginGoogle():void {
    this.userService.loginGoogleUser()
    .then(res => {
    console.log('res', res);
      //this.updateUserData(credential.user)
    })
    .catch(err => this.showAuthError(err.code, err.message));
  }

  showAuthError(errorCode: string, errorMsg: string){
    this.error.state = true;

    if (errorCode == "auth/invalid-email") this.error.msg = "Email invalido";
    else if (errorCode == "auth/user-not-found") this.error.msg = "El usuario no se encuentra registrado";
    else if (errorCode == "auth/wrong-password") this.error.msg = "Usuario o contraseña incorrecta";
    else if (errorCode == "auth/popup-closed-by-user") this.error.msg = "Procedimiento de logueo no completado";
    else if (errorCode == "auth/email-already-in-use") this.error.msg = "El email ya se encuentra registrado";
    else this.error.msg = errorMsg;
  }

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