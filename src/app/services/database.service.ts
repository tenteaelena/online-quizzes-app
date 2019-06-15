import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private _val = '';

  // get vals() {
  //   return this._val.asObservable();
  // }

  constructor(private db: AngularFireDatabase) { }

  getSomething(): Observable<string>{
    //get users from database
    let ref = this.db.database.ref('/users');
    ref.on('value', function(snapshot){
      this._val = snapshot.val();
    }.bind(this));
    return null;
  }

}
