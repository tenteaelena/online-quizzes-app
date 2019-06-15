import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';
import * as firebase from 'firebase';
import {PizzaPartyComponent} from '../pizza-party/pizza-party.component';
import {MatSnackBar} from '@angular/material';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    console.log('login guard ' + localStorage.getItem('uid') != null);
    if (localStorage.getItem('uid') != null) {
      console.log('login guard ' + firebase.auth().currentUser);
      //alert('you cant access this');
      this.showMessage('You can\'t access this!')
      this.router.navigate(['index']);
      return false;
    }
    return true;
  }

  showMessage(msg: string) {
    this.snackBar.openFromComponent(PizzaPartyComponent, {
      duration: 1000,
      data: {text: msg}
    });
  }
}
