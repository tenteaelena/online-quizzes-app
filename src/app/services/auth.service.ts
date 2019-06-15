import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
import {PizzaPartyComponent} from '../pizza-party/pizza-party.component';
import {MatSnackBar} from '@angular/material';
import {AngularFireDatabase} from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _user = null;

  constructor(private firebaseAuth: AngularFireAuth, private firebaseDatabase: AngularFireDatabase, private router: Router, private snackBar: MatSnackBar) {
    this._user = firebaseAuth.authState;
  }

  signup(name: string, surname: string, university: string, email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {

        //save info about user
        var refT = this.firebaseDatabase.database.ref('users/'+this.firebaseAuth.auth.currentUser.uid+'/loginInfo');
        refT.set({
          email: email,
          name: name,
          surname: surname,
          islogged: false,
          university: university,
          role: 'user'
        }).then(()=>{
          this.login(email, password);
        });
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login(email: string, password: string) {
    let isLoggedIn: string = '';

    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .catch(function(error){
        this.showMessage(error.message, 2500);
      }.bind(this))
      .then(() => {
      firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/loginInfo/islogged').once('value').then(function (snapshot) {
        isLoggedIn = '' + snapshot.val();
        if (isLoggedIn === 'true') {
          this.showMessage('Allready logged in!', 2000);
          this.logout();
        } else {
          this.showMessage('Logged in!', 1000);

          //save data in local store
          localStorage.setItem('uid', firebase.auth().currentUser.uid);

          //set login var to true in database
          var ref = firebase.database().ref('users/' + firebase.auth().currentUser.uid + '/loginInfo');
          ref.update({islogged: true});

          this.router.navigate(['index']);
        }
      }.bind(this));

    });
  }

  logout() {

    var ref = firebase.database().ref('users/' + localStorage.getItem('uid') + '/loginInfo');
    ref.update({islogged: false});

    localStorage.removeItem('uid');

    this.firebaseAuth
      .auth
      .signOut();

    this.showMessage('Logged out!', 1000);

    this.router.navigate(['login']);
  }


  showMessage(msg: string, duration: number) {
    this.snackBar.openFromComponent(PizzaPartyComponent, {
      duration: duration,
      data: {text: msg}
    });
  }

}
