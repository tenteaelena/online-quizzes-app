import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  signUp: FormGroup;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.signUp = new FormGroup({
      name: new FormControl(),
      surname: new FormControl(),
      university: new FormControl(),
      email: new FormControl(),
      password: new FormControl()
    });
  }

  onSignUp() {
    this.authService.signup(
      this.signUp.value.name,
      this.signUp.value.surname,
      this.signUp.value.university,
      this.signUp.value.email,
      this.signUp.value.password
    );
  }

}
