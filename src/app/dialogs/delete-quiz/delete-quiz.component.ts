import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import * as firebase from 'firebase';

@Component({
  selector: 'app-delete-quiz',
  templateUrl: './delete-quiz.component.html',
  styleUrls: ['./delete-quiz.component.css']
})
export class DeleteQuizComponent implements OnInit {

  htmlContent: string;

  constructor(public dialogRef: MatDialogRef<DeleteQuizComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

  path = 'users/' + localStorage.getItem('uid') + '/quizez';

  ngOnInit() {
  }

  onClose(){ //close dialog
    this.dialogRef.close();
  }

  onYes(){
    let newPath = this.path+'/'+this.data.quizToDelete;

    firebase.database().ref(newPath).remove(); //remove quiz from database

    this.onClose();

    setTimeout(function(){ //reload page after 1.5 seconds
      window.location.reload();
    },1500);
  }

}
