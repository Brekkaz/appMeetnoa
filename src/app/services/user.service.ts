import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore) { }

  registerEmailPasswordUser(email: string, password: string){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(res => resolve(res), err => reject(err))
    })
  }

  loginEmailPasswordUser(email: string, password: string){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => resolve(res), err => reject(err))
    })
  }

  loginFacebookUser(){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider())
      .then(res => {
        this.updateBasicUserData({
          uid:res.user.uid,
          firstname: (<any>res.additionalUserInfo.profile).first_name,
          lastname: (<any>res.additionalUserInfo.profile).last_name,
          email: res.user.email,
          birthdate: null,
          sex: null
        });
        resolve(res);
      }, err => reject(err))
    })
  }

  loginGoogleUser(){
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
      .then(res => {
        this.updateBasicUserData({
          uid:res.user.uid,
          firstname: (<any>res.additionalUserInfo.profile).given_name,
          lastname: (<any>res.additionalUserInfo.profile).family_name,
          email: res.user.email,
          birthdate: null,
          sex: null
        });
        resolve(res);
      }, err => reject(err))
    })
  }

  logoutUser(){
    return this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState.pipe(map(auth => auth));
  }
  
  updateBasicUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const data = {
      id: user.uid,
      firstname:user.firstname,
      lastname:user.lastname,
      email: user.email,
      birthdate:user.birthdate,
      sex:user.sex
    }
    return userRef.set(data, { merge: true })
  }
}

/*.addScope('user_birthday')*/