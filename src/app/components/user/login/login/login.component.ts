import { DOCUMENT } from '@angular/common';
import { Component, OnInit, Renderer2, OnDestroy, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit, OnDestroy {
  public formLogin: FormGroup;
  public formRegister: FormGroup;
  public error={ state:false, msg:'' };

  uploadPercent: Observable<number>;
  urlImg: Observable<string>;
  refPhoto;


  constructor(
    private afStorage: AngularFireStorage,
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
      sex: ['', [Validators.required]],
      photo: ['', [Validators.required]]
    });
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
    })
    .catch(err => this.showAuthError(err.code, err.message));
  }
  

  onRegister() {
    const filePath = `uploads/${this.getUid()}.jpg`;
    const ref = this.afStorage.ref(filePath);
    const task = this.afStorage.upload(filePath, this.refPhoto);
    this.uploadPercent = task.percentageChanges();
    task.snapshotChanges().pipe(finalize(()=> this.urlImg = ref.getDownloadURL())).subscribe();


    console.log(this.refPhoto)
    /*for(let i in this.formRegister.controls)
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
    }).catch(err => this.showAuthError(err.code, err.message));*/
  }
  
  loginOk(){

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

  getUid(): string {
    let seq1 = Math.floor(Math.random() * (99 - 10)) + 10;
    let seq2 = Math.floor(Math.random() * (99 - 10)) + 10;
    let date = new Date();
    let year = date.getFullYear();
    let mounth = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth();
    let day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate(); 
    let hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours(); 
    let minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes(); 
    let seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
    let milliseconds = date.getMilliseconds() < 10 ? `00${date.getMilliseconds()}` : date.getMilliseconds() < 100 ? `0${date.getMilliseconds()}` : date.getMilliseconds();

    //año[4]mes[2]dia[2]hora[2]minutos[2]segundos[2]milesimas[3]seq1[2]seq2[2]
    return `${year}${mounth}${day}${hours}${minutes}${seconds}${milliseconds}${seq1}${seq2}`;
  }

  onUploadPhoto(e){
    if (e.target.files[0]) {
      let file = e.target.files[0];
      this.refPhoto = file;
    }
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