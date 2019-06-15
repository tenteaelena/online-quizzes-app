import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {

  finish: boolean;

  constructor(private db: AngularFireDatabase) {
    this.path = 'users/'+localStorage.getItem('uid')+'/loginInfo/';

    this.finish = false;

    let name = '';
    let surname = '';
    this.db.database.ref(this.path ).once('value').then(function (snapshot) {
      name = snapshot.child('name').val();
      surname = snapshot.child('surname').val();
      console.log(name);
      console.log(surname);
      this.utilizator = name + ' ' + surname;
      this.finish = true;
    }.bind(this));
  }

  path: string;
  utilizator: any;

  ngOnInit() {
  }

}
