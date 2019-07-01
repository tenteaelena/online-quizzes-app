import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  signIn: FormGroup;

  constructor(private authService: AuthService){

  }

  ngOnInit() {
    this.signIn = new FormGroup({
      email1: new FormControl(),
      password1: new FormControl()
    });
  }

  onSignIn() {
    this.authService.login(this.signIn.value.email1, this.signIn.value.password1);
  }

}
