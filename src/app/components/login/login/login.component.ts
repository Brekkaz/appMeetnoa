import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder, 
    private afsAuth: AngularFireAuth, 
    private afs: AngularFirestore) {}

  public ngOnInit() {
    this.buildForm();
  }

  private buildForm() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)/*, this.validatePassword*/]]
    });
  }

  onLoginEmail() {
    this.afsAuth.auth.signInWithEmailAndPassword(this.formLogin.value.email, this.formLogin.value.password)
    .then(UserData => console.log(UserData),//ok
    err => console.log(err))//fail
  }

  onRegister() {
    this.afsAuth.auth.createUserWithEmailAndPassword(this.formLogin.value.email, this.formLogin.value.password)
    .then(UserData => console.log(UserData),//ok
    err => console.log(err))//fail
  }

  onLoginGoogle():void {
    this.afsAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
    .then(credential => {
      this.updateUserData(credential.user)
    })
    .catch(err => console.log('err', err.message));
  }

  onLoginFacebook(): void {
    this.afsAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()/*.addScope('user_birthday')*/)
    .then(credential => {
      /*console.log(credential.user);
      console.log(credential.additionalUserInfo);
      console.log(credential.operationType);
      console.log(credential.credential);*/

      this.updateUserData(credential.user)
    })
    .catch(err => console.log('err', err.message));
  }

  isAuth() {
    return this.afsAuth.authState.pipe(map(auth => auth));
  }

  onLogout():void {
    this.afsAuth.auth.signOut();
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const data = {
      id: user.uid,
      email: user.email,
      roles: {
        editor: true
      }
    }
    return userRef.set(data, { merge: true })
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